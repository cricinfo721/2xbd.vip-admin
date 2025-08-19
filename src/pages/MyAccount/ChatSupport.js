import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Container,
  Col,
  Row,
  ListGroup,
  Form,
  Button,
  Card,
  Badge,
} from "react-bootstrap";
import MyAccountSidebar from "../../components/MyAccountSidebar";
import helpers from "../../utils/helpers";
import AuthContext from "../../context/AuthContext";
import Breadcrumbs from "./Breadcrumbs";
import "./chat.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import {
  faMicrophone,
  faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons"; // Correct import path
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import Swal from "sweetalert2";
import ImageModal from "./ImageModal";
import { io } from "socket.io-client";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { DropdownButton, Dropdown ,FormControl ,InputGroup} from "react-bootstrap";

// Connect to the socket.io server
const socket = io(process.env.REACT_APP_CHAT_SOCKET, {
  transports: ["websocket"], // Use only WebSocket transport
  query: {
    token: localStorage.getItem("token"),
  },
});

const ChatSupport = () => {
  let baseURL = process.env.REACT_APP_API_BASE_URL;
  let { user_coins } = useContext(AuthContext);
  const [senderId, setSenderId] = useState("6713772f106ac41f0d6c3d3e");
  const [receiverId, setReceiverId] = useState(null);
  const isReceiverId = useRef(null);
  const isChatId = useRef(null);
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
  const [currentImageSrc, setCurrentImageSrc] = useState(""); // State for current image
  const isFirstRender = useRef(true);
  const [lastMsgId, setLastMsgId] = useState(null);

  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [activeUserIndex, setActiveUserIndex] = useState(); // Initially, the first user is active

  // ----------  This code for audio recording from here ----------
  const [recording, setRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [audioChunks, setAudioChunks] = useState([]);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const isCanceledRef = useRef(false);

  const [searchQuery, setSearchQuery] = useState("");
  const audioRef = useRef(null); // Update the path according to your structure

  // Search handler
  const handleSearch = (event) => {
    const searchQuery = event.target.value.toLowerCase(); // Get search input and convert to lowercase
    setSearchQuery(searchQuery); // Update search query state

    // console.log("Call for searching ...... ", searchQuery);
    // Sort users based on the search query (by username)
    if(searchQuery===""){
      socket.emit("getInbox", senderId);
    }else{
      const sortedData = users.sort((a, b) => {
        if (a.username && b.username) {
          // If there's a search query, sort by whether the username includes the query
          if (searchQuery) {
            const aIncludes = a.username.toLowerCase().includes(searchQuery);
            const bIncludes = b.username.toLowerCase().includes(searchQuery);
            
            // Sort based on inclusion, giving priority to matches
            if (aIncludes && !bIncludes) return -1; // a comes before b
            if (!aIncludes && bIncludes) return 1;  // b comes before a
          }
          // Sort alphabetically if no matches
          return a.username.localeCompare(b.username);
        }
        return 0; // names are equal or one is null
      });
      // Update users with sorted data
      setUsers([...sortedData]); // Use spread operator to trigger re-render
    }
  };

  const token = localStorage.getItem("token");

  // Timer interval
  useEffect(() => {
    let interval = null;
    if (recording) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000); // Update timer every second
    } else if (!recording && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [recording, timer]);

  // Function to stop the recording (save and send audio)
  const stopRecording = () => {
    console.log("........................ STOPING .....................");
    if (mediaRecorder) {
      isCanceledRef.current = false; // Reset cancel flag
      mediaRecorder.stop(); // Stop the recorder
      setRecording(false);
    }
  };

  // Function to cancel the recording (discard audio)
  const cancelRecording = () => {
    console.log("........................ CANCEL .....................");
    if (mediaRecorder) {
      isCanceledRef.current = true; // Set cancel flag
      mediaRecorder.stop(); // Stop the recorder
      setRecording(false);
    }
  };

  // Function to start recording
  const startRecording = async () => {
    try {
      const chunks = []; // Local variable to store audio chunks

      setTimer(0); // Reset timer when starting a new recording
      isCanceledRef.current = false; // Reset cancel state before recording

      // Access the user's microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      // Log if the recorder is successfully created
      // console.log("MediaRecorder initialized", recorder);

      // Event for data availability
      recorder.ondataavailable = (event) => {
        // console.log("ondataavailable event", event.data.size); // Log data size
        if (event.data.size > 0) {
          chunks.push(event.data); // Add chunk to local variable
        }
      };

      // Event when recording stops (Triggered by stop or cancel)
      recorder.onstop = () => {
        // console.log("Recording stopped");
        const audioBlob = new Blob(chunks, { type: "audio/wav" }); // Create Blob from local chunks
        console.log("Blob size after stop:", audioBlob.size);

        if (!isCanceledRef.current) {
          // Only send the audioBlob if the recording is not canceled
          if (audioBlob.size > 0) {
            sendAudioMessage(audioBlob);
          } else {
            console.error("Audio Blob is empty after recording");
          }
        } else {
          console.log("Recording canceled.");
        }

        // Stop all audio tracks to release the microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      // Start recording and ensure data availability every 1 second
      recorder.start(1000); // Pass timeslice (1000ms = 1 second)

      setMediaRecorder(recorder);
      setRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      Swal.fire({
        icon: "error",
        title: "Microphone Access Denied",
        text: "Please allow microphone access in your browser settings.",
      });
    }
  };

  // Send audio message
  const sendAudioMessage = async (audioBlob) => {
    const formData = new FormData();
    formData.append("BannerFile", audioBlob, "recording.wav");
    formData.append("fileType", "audio");
    console.log("Sending audioBlob of size : ----- 1 ------ ", audioBlob);

    // const token = process.env.REACT_APP_BEARER_TOKEN;

    // Send the FormData to the API
    try {
      const response = await axios.post(
        `${baseURL}v1/admin/banner-upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Include the Bearer token
          },
        }
      );

      // console.log("File uploaded successfully:", response.data);

      // Create a new message object
      const newMessage = {
        message: "", // Leave the text empty for file uploads
        file: response.data.path, // Store the file path for rendering
        fileType: "AUDIO", // Get the file type
        senderId: senderId, // Add sender ID
        receiverId: receiverId, // Add receiver ID
        createdAt: new Date(),
      };

      // Emit the new message via socket
      socket.emit("sendMessage", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setLoading(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      setLoading(false);
    }
  };
  // Format time as MM:SS
  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  const handleUserClick = (index,userId, chatId) => {
    // console.log("data chatId : ", chatId , " User id : ",userId);
    isReceiverId.current = userId;
    isChatId.current =  chatId;
    setChatId(chatId);
    setReceiverId(userId);
    setActiveUserIndex(index); // Set the clicked user as active
    socket.emit("getChatHistory", chatId, function (data) {
      setLoading(false); // Set loading to false when data is fetched
    });
    
    socket.emit("markAsRead", chatId, senderId);
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.chatId === chatId ? { ...user, unreadCount: 0 } : user
      )
    );
    
    setReceiverId(userId);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      if(senderId && receiverId){
        setMessages([
          ...messages,
          {
            message: message,
            senderId: senderId,
            receiverId: receiverId,
            timestamp: new Date(),
            fileType: "text",
          },
        ]);
        socket.emit("sendMessage", {
          message: message,
          senderId: senderId,
          receiverId: receiverId,
          fileType: "text",
        });
        setMessage("");
      }
    }
  };
  useEffect(() => {
    if (!isFirstRender.current) {
      messagesEndRef.current.scrollTo({
        top: messagesEndRef.current.scrollHeight,
        behavior: 'smooth'  // Add smooth scrolling
      });
    } else {
      isFirstRender.current = false; // Set to false after first render
    }
  }, [messages]); // Scroll when messages change

  // Function to format only time from the timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
  
    // Format the date part (e.g., "May 5 2024")
    const datePart = date.toLocaleDateString("en-US", {
      year: "2-digit",
      month: "short",   // "short" for abbreviated month name (e.g., "May")
      day: "numeric",
    });
  
    // Format the time part (e.g., "01:20 AM")
    const timePart = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  
    // Combine the date and time parts
    return `${datePart} ${timePart}`;
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (file && validTypes.includes(file.type)) {
      // Create a FormData object
      const formData = new FormData();
      formData.append("BannerFile", file);
      // const token = process.env.REACT_APP_BEARER_TOKEN;
      // Send the FormData to the API
      await axios
        .post(baseURL + "v1/admin/banner-upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Include the Bearer token
          },
        })
        .then((response) => {
          // console.log("File uploaded successfully:", response);
          // Handle success response here, e.g., update UI

          // Creating a new message object
          const newMessage = {
            message: "", // Leave the text empty for file uploads
            file: response.data.path, // Store the Base64 string for rendering the image
            fileType: "IMAGE", // Get the file extension
            senderId: senderId,
            receiverId: receiverId,
            createdAt: new Date(),
            //status :'sent'
          };

          // Update the state with the new message
          socket.emit("sendMessage", newMessage);
          setMessages((prevMessages) => [...prevMessages, newMessage]);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
          setLoading(false);
          // Handle error response here
        });
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid File!",
        text: "Please upload a valid image file (PNG, JPEG, JPG).",
      });
      setLoading(false);
    }
  };

  const openModal = (imageSrc) => {
    setCurrentImageSrc(imageSrc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {

    // Preload audio file (not strictly necessary, but good practice)
    if (audioRef.current) {
      audioRef.current.load();
    }

    // Log connection status
    socket.on("connect", () => {
      console.log("Connected to the server");
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("Disconnected from the server");
    });

    // Handle connection errors
    socket.on("connect_error", (err) => {
      console.error("Connection Error:", err);
    });

    socket.on("chatHistory", function (data) {
      // console.log("data chatHistory : ", data);
      setMessages(data);
      setLoading(false);
    });

    socket.emit("getInbox", senderId,( data )=> {
      console.log("getInbox data : ",data)
    });
    socket.on("inboxData", function (data) {
      // console.log("data inboxData --- : ", JSON.stringify(data));
      // Sort data by createdAt in descending order
      const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setUsers(sortedData);
    });

    socket.on("newMessage", function (data) {
      if (audioRef.current) {
        // console.log("audioRef.current : ",audioRef.current)
        audioRef.current.load();
        audioRef.current.play();
      }
      // console.log("data newMessage --- : ", JSON.stringify(data));
      // console.log("receiverId --- : ", receiverId , isReceiverId.current);
      // console.log("senderId --- : ", senderId);
      // console.log("chatId --- : ", data.chatId , data.chatId , ((data.sender == isReceiverId.current) && (chatId == data.chatId)));
      // console.log((data.sender +"=="+ isReceiverId.current) +" && "+ (chatId +"=="+ data.chatId))
      if ((data.sender == isReceiverId.current)) {
          //setMessages((prevMessages) => [...prevMessages, data]);
          socket.emit("getChatHistory", isChatId.current, function (data) {
            setLoading(false); // Set loading to false when data is fetched
          });
          socket.emit("markAsRead", isChatId.current, senderId);
      }
      //if (chatId != data.chatId) {
        socket.emit("getInbox", senderId);
      //}

    });

    socket.on("messagesRead", function (data) {
      // console.log("data messagesRead --- : ", JSON.stringify(data));
      setMessages((prevMessages) =>
        prevMessages.map((message) => ({ ...message, isRead: true }))
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.chatId === chatId ? { ...user, unreadCount: 0 } : user
        )
      );
    });

    socket.on("messageDeleted", function (data) {
      // console.log("data messageDeleted --- : ", JSON.stringify(data));
      setMessages((prevMessages) =>
        prevMessages.filter((message) => !data.messageIds.includes(message._id))
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.chatId === chatId ? { ...user, unreadCount: 0 } : user
        )
      );
    });

  }, []);

  const handleDelete = (msgId) => {
    // console.log("msgId : =====", msgId);
    // Emit delete event to the server
    socket.emit("deleteMessage", chatId, msgId);
    // Update local state to remove the message
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message._id !== msgId)
    );
  };

  return (
    <div>
      <section className="py-4 main-inner-outer">
        <Container fluid>
          <Breadcrumbs />
          <Row>
            <Col md={3} className="user-list ">
              <h4>Members</h4>
              <FormControl
                type="text"
                placeholder="Search"
                className="mb-3 rounded-pill"
                value={searchQuery}
                onKeyUp={(e) => {
                  handleSearch(e);
                }}
                onChange={handleSearch} // You can still use onChange for real-time search
                style={{ borderRadius: "50px" }} 
              />
              <ListGroup>
                {users.map((user, index) => (
                  <ListGroup.Item
                    key={index}
                    className={`user-item ${
                      index === activeUserIndex ? "active" : ""
                    }`}
                    onClick={() => handleUserClick(index,user?.userId, user?.chatId)}
                  >
                    <FontAwesomeIcon icon={faUser} className="me-2" />
                    
                    <span className="d-flex"> 
                      {user?.username} 
                      <span className="msg-time">
                        {user?.createdAt ? formatDateTime(user.createdAt) : "  "}
                      </span>
                    </span>
                    {user?.unreadCount > 0 && (
                      <span style={{ textAlign: "center", paddingLeft: "20px", fontSize: "12px" }}>
                        {user?.lastMessage?.length > 40
                          ? user.lastMessage.slice(0, 40) + '...'
                          : user.lastMessage}
                      </span>
                    )}
                    
                    {user?.unreadCount > 0 && (
                      <Badge pill bg="default" className="custom-badge ms-2">
                        {user?.unreadCount}
                      </Badge>
                    )}
                   
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
            <Col md={9}>
              <Card className="chat-card">
                <Card.Header className="chat-header">
                  <b>Chat Box</b>
                </Card.Header>
                <Card.Body className="chat-body" ref={messagesEndRef}>
                  <div className="message-container" >
                    {messages && messages.length > 0 ? (
                      messages.map((msg, index) => (
                        <div
                          key={index}
                          className={`message ${
                            msg?.receiver === senderId ||
                            msg?.receiver?._id === senderId
                              ? "received"
                              : "sent"
                          }`}
                        >
                          <div className="action-btn">
                            <DropdownButton
                              id="dropdown-item-button"
                              title=""
                              variant="link"
                            >
                              {/* <Dropdown.Item as="button" onClick={() => handleEdit(messageId)}>Edit</Dropdown.Item> */}
                              <Dropdown.Item
                                as="button"
                                onClick={() => handleDelete(msg?._id)}
                              >
                                Delete
                              </Dropdown.Item>
                            </DropdownButton>
                          </div>
                          <div className="msg">
                            <span>
                              {msg.message}
                              {msg.file && (
                                <>
                                  {msg.fileType === "IMAGE" && (
                                    <img
                                      src={`${baseURL}${msg.file}`}
                                      alt={`Uploaded ${msg.fileType}`}
                                      className="uploaded-image"
                                      onClick={() =>
                                        openModal(`${baseURL}${msg.file}`)
                                      }
                                      style={{ cursor: "pointer" }}
                                    />
                                  )}
                                  {msg.fileType === "AUDIO" && (
                                    <audio controls>
                                      <source
                                        src={baseURL + msg.file}
                                        type="audio/wav"
                                      />
                                      Your browser does not support the audio
                                      element.
                                    </audio>
                                  )}
                                </>
                              )}
                            </span>
                            <span className="time">
                              {msg.timestamp
                                ? formatTime(msg.timestamp)
                                : formatTime(msg.createdAt)}
                            </span>
                            {msg.isRead === false && (
                              <span className="status-icon">✔</span>
                            )}
                            {msg.isRead === true && (
                              <span className="status-icon">✔✔</span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ height: "60vh" }}
                      >
                        <svg
                          viewBox="0 0 303 172"
                          width="360"
                          preserveAspectRatio="xMidYMid meet"
                          class=""
                          fill="none"
                        >
                          <title>intro-md-beta-logo-light</title>
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M229.565 160.229C262.212 149.245 286.931 118.241 283.39 73.4194C278.009 5.31929 212.365 -11.5738 171.472 8.48673C115.998 35.6999 108.972 40.1612 69.2388 40.1612C39.645 40.1612 9.51318 54.4147 5.7467 92.952C3.0166 120.885 13.9985 145.267 54.6373 157.716C128.599 180.373 198.017 170.844 229.565 160.229Z"
                            fill="#bb4b7c"
                          ></path>
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M131.589 68.9422C131.593 68.9422 131.596 68.9422 131.599 68.9422C137.86 68.9422 142.935 63.6787 142.935 57.1859C142.935 50.6931 137.86 45.4297 131.599 45.4297C126.518 45.4297 122.218 48.8958 120.777 53.6723C120.022 53.4096 119.213 53.2672 118.373 53.2672C114.199 53.2672 110.815 56.7762 110.815 61.1047C110.815 65.4332 114.199 68.9422 118.373 68.9422C118.377 68.9422 118.381 68.9422 118.386 68.9422H131.589Z"
                            fill="white"
                          ></path>
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M105.682 128.716C109.186 128.716 112.026 125.908 112.026 122.446C112.026 118.983 109.186 116.176 105.682 116.176C104.526 116.176 103.442 116.481 102.509 117.015L102.509 116.959C102.509 110.467 97.1831 105.203 90.6129 105.203C85.3224 105.203 80.8385 108.616 79.2925 113.335C78.6052 113.143 77.88 113.041 77.1304 113.041C72.7503 113.041 69.1995 116.55 69.1995 120.878C69.1995 125.207 72.7503 128.716 77.1304 128.716C77.1341 128.716 77.1379 128.716 77.1416 128.716H105.682L105.682 128.716Z"
                            fill="white"
                          ></path>
                          <rect
                            x="0.445307"
                            y="0.549558"
                            width="50.5797"
                            height="100.068"
                            rx="7.5"
                            transform="matrix(0.994522 0.104528 -0.103907 0.994587 10.5547 41.6171)"
                            fill="#00a122"
                            stroke="#316474"
                          ></rect>
                          <rect
                            x="0.445307"
                            y="0.549558"
                            width="50.4027"
                            height="99.7216"
                            rx="7.5"
                            transform="matrix(0.994522 0.104528 -0.103907 0.994587 10.9258 37.9564)"
                            fill="white"
                            stroke="#316474"
                          ></rect>
                          <path
                            d="M57.1609 51.7354L48.5917 133.759C48.2761 136.78 45.5713 138.972 42.5503 138.654L9.58089 135.189C6.55997 134.871 4.36688 132.165 4.68251 129.144L13.2517 47.1204C13.5674 44.0992 16.2722 41.9075 19.2931 42.2251L24.5519 42.7778L47.0037 45.1376L52.2625 45.6903C55.2835 46.0078 57.4765 48.7143 57.1609 51.7354Z"
                            fill="#EEFEFA"
                            stroke="#316474"
                          ></path>
                          <path
                            d="M26.2009 102.937C27.0633 103.019 27.9323 103.119 28.8023 103.21C29.0402 101.032 29.2706 98.8437 29.4916 96.6638L26.8817 96.39C26.6438 98.5681 26.4049 100.755 26.2009 102.937ZM23.4704 93.3294L25.7392 91.4955L27.5774 93.7603L28.7118 92.8434L26.8736 90.5775L29.1434 88.7438L28.2248 87.6114L25.955 89.4452L24.1179 87.1806L22.9824 88.0974L24.8207 90.3621L22.5508 92.197L23.4704 93.3294ZM22.6545 98.6148C22.5261 99.9153 22.3893 101.215 22.244 102.514C23.1206 102.623 23.9924 102.697 24.8699 102.798C25.0164 101.488 25.1451 100.184 25.2831 98.8734C24.4047 98.7813 23.5298 98.6551 22.6545 98.6148ZM39.502 89.7779C38.9965 94.579 38.4833 99.3707 37.9862 104.174C38.8656 104.257 39.7337 104.366 40.614 104.441C41.1101 99.6473 41.6138 94.8633 42.1271 90.0705C41.2625 89.9282 40.3796 89.8786 39.502 89.7779ZM35.2378 92.4459C34.8492 96.2179 34.4351 99.9873 34.0551 103.76C34.925 103.851 35.7959 103.934 36.6564 104.033C37.1028 100.121 37.482 96.1922 37.9113 92.2783C37.0562 92.1284 36.18 92.0966 35.3221 91.9722C35.2812 92.1276 35.253 92.286 35.2378 92.4459ZM31.1061 94.1821C31.0635 94.341 31.0456 94.511 31.0286 94.6726C30.7324 97.5678 30.4115 100.452 30.1238 103.348L32.7336 103.622C32.8582 102.602 32.9479 101.587 33.0639 100.567C33.2611 98.5305 33.5188 96.4921 33.6905 94.4522C32.8281 94.3712 31.9666 94.2811 31.1061 94.1821Z"
                            fill="#00a122"
                          ></path>
                          <path
                            d="M17.892 48.4889C17.7988 49.3842 18.4576 50.1945 19.3597 50.2923C20.2665 50.3906 21.0855 49.7332 21.1792 48.8333C21.2724 47.938 20.6136 47.1277 19.7115 47.0299C18.8047 46.9316 17.9857 47.5889 17.892 48.4889Z"
                            fill="white"
                            stroke="#316474"
                          ></path>
                          <path
                            d="M231.807 136.678L197.944 139.04C197.65 139.06 197.404 139.02 197.249 138.96C197.208 138.945 197.179 138.93 197.16 138.918L196.456 128.876C196.474 128.862 196.5 128.843 196.538 128.822C196.683 128.741 196.921 128.668 197.215 128.647L231.078 126.285C231.372 126.265 231.618 126.305 231.773 126.365C231.814 126.381 231.842 126.395 231.861 126.407L232.566 136.449C232.548 136.463 232.522 136.482 232.484 136.503C232.339 136.584 232.101 136.658 231.807 136.678Z"
                            fill="white"
                            stroke="#316474"
                          ></path>
                          <path
                            d="M283.734 125.679L144.864 135.363C141.994 135.563 139.493 133.4 139.293 130.54L133.059 41.6349C132.858 38.7751 135.031 36.2858 137.903 36.0856L276.773 26.4008C279.647 26.2005 282.144 28.364 282.345 31.2238L288.578 120.129C288.779 122.989 286.607 125.478 283.734 125.679Z"
                            fill="white"
                          ></path>
                          <path
                            d="M144.864 135.363C141.994 135.563 139.493 133.4 139.293 130.54L133.059 41.6349C132.858 38.7751 135.031 36.2858 137.903 36.0856L276.773 26.4008C279.647 26.2004 282.144 28.364 282.345 31.2238L288.578 120.129C288.779 122.989 286.607 125.478 283.734 125.679"
                            stroke="#316474"
                          ></path>
                          <path
                            d="M278.565 121.405L148.68 130.463C146.256 130.632 144.174 128.861 144.012 126.55L138.343 45.695C138.181 43.3846 139.994 41.3414 142.419 41.1723L272.304 32.1142C274.731 31.945 276.81 33.7166 276.972 36.0271L282.641 116.882C282.803 119.193 280.992 121.236 278.565 121.405Z"
                            fill="#EEFEFA"
                            stroke="#316474"
                          ></path>
                          <path
                            d="M230.198 129.97L298.691 125.193L299.111 131.189C299.166 131.97 299.013 132.667 298.748 133.161C298.478 133.661 298.137 133.887 297.825 133.909L132.794 145.418C132.482 145.44 132.113 145.263 131.777 144.805C131.445 144.353 131.196 143.684 131.141 142.903L130.721 136.907L199.215 132.131C199.476 132.921 199.867 133.614 200.357 134.129C200.929 134.729 201.665 135.115 202.482 135.058L227.371 133.322C228.188 133.265 228.862 132.782 229.345 132.108C229.758 131.531 230.05 130.79 230.198 129.97Z"
                            stroke="#316474"
                            fill="#00a122"
                          ></path>
                          <path
                            d="M230.367 129.051L300.275 124.175L300.533 127.851C300.591 128.681 299.964 129.403 299.13 129.461L130.858 141.196C130.025 141.254 129.303 140.627 129.245 139.797L128.987 136.121L198.896 131.245C199.485 132.391 200.709 133.147 202.084 133.051L227.462 131.281C228.836 131.185 229.943 130.268 230.367 129.051Z"
                            fill="white"
                            stroke="#316474"
                          ></path>
                          <ellipse
                            rx="15.9969"
                            ry="15.9971"
                            transform="matrix(0.997577 -0.0695704 0.0699429 0.997551 210.659 83.553)"
                            stroke="#316474"
                            fill="#bb4b7c"
                          ></ellipse>
                          <path
                            d="M208.184 87.1094L204.777 84.3593C204.777 84.359 204.776 84.3587 204.776 84.3583C203.957 83.6906 202.744 83.8012 202.061 84.6073C201.374 85.4191 201.486 86.6265 202.31 87.2997L202.312 87.3011L207.389 91.4116C207.389 91.4119 207.389 91.4121 207.389 91.4124C208.278 92.1372 209.611 91.9373 210.242 90.9795L218.283 78.77C218.868 77.8813 218.608 76.6968 217.71 76.127C216.817 75.5606 215.624 75.8109 215.043 76.6939L208.184 87.1094Z"
                            fill="white"
                            stroke="#316474"
                          ></path>
                        </svg>
                      </div>
                    )}
                  </div>
                </Card.Body>
                <Card.Footer>
                  <Form onSubmit={sendMessage} className="d-flex">
                    <div
                      class="actions attachment"
                      onClick={() =>
                        document.getElementById("file-upload").click()
                      }
                    >
                      <FontAwesomeIcon
                        icon={faPaperclip}
                        style={{ color: "#00a122", fontSize: "20px" }}
                      />
                    </div>
                    <input
                      type="file"
                      id="file-upload"
                      style={{ display: "none" }}
                      onChange={handleFileUpload}
                      accept="image/png, image/jpeg, image/jpg"
                    />
                    <Form.Control
                      type="text"
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="message-input  me-2"
                    />

                    {recording ? (
                      <div className="timer-audio">
                        <FontAwesomeIcon
                          icon={faMicrophone}
                          style={{ color: "#00a122", fontSize: "20px" }}
                        />
                        {formatTimer(timer)}
                        <button class="close-button" onClick={cancelRecording}>
                          ×
                        </button>
                      </div>
                    ) : (
                      <div
                        className="actions recording more"
                        onClick={recording ? stopRecording : startRecording}
                      >
                        <FontAwesomeIcon
                          icon={recording ? faMicrophoneSlash : faMicrophone}
                          style={{ color: "#00a122", fontSize: "20px" }}
                        />
                      </div>
                    )}

                   
                    {recording ? (
                      <Button
                        variant="primary"
                        type="submit"
                        onClick={recording ? stopRecording : startRecording}
                      >
                        Send
                      </Button>
                    ) : (
                      <Button variant="primary" type="submit">
                        Send
                      </Button>
                    )}
                  </Form>
                  {/* Image Modal */}
                  <ImageModal
                    isOpen={isModalOpen}
                    imageSrc={currentImageSrc}
                    onClose={closeModal}
                  />
                  <video  ref={audioRef} controls oncontextmenu="return false;"  style={{display:"none"}}>
                      <source src="https://ag.cricxo.bet/whatsapp_web.mp3" type="video/mp4" />
                      Your browser does not support the video tag.
                  </video>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default ChatSupport;
