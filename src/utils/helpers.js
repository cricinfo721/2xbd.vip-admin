import moment from "moment";

const obj = {
  currencyFormat: (number = "") => {
    // return new Intl.NumberFormat('en-IN', {}).format(number)
    const options = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
    const formatted = Number(number).toLocaleString("en", options);
    return formatted;
  },
  dateFormat: (date, timeZone) => {
    var convertedDate = new Date(date).toLocaleString(undefined, {
      timeZone:  "Asia/Dhaka",//timeZone ? timeZone :
    });
    return convertedDate.toString(); //return  moment(convertedDate).format("DD-MM-YYYY, h:mm:ss A");
  },
  msgDateFormat: (date, timeZone) => {
    var convertedDate = new Date(date).toLocaleDateString(undefined, {
      timeZone: timeZone ? timeZone : "Asia/Kolkata",
    });

    return convertedDate.toString();
  },
  truncateDecimals :(num, digits)  =>{
    var numS = num.toString(),
        decPos = numS.indexOf('.'),
        substrLength = decPos == -1 ? numS.length : 1 + decPos + digits,
        trimmedResult = numS.substr(0, substrLength),
        finalResult = isNaN(trimmedResult) ? 0 : trimmedResult;

    return parseFloat(finalResult);
    
},
timeAgo :(date)  =>{
  const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    const intervals = [
        { label: "year", seconds: 31536000 },
        { label: "month", seconds: 2592000 },
        { label: "week", seconds: 604800 },
        { label: "day", seconds: 86400 },
        { label: "hour", seconds: 3600 },
        { label: "minute", seconds: 60 },
        { label: "second", seconds: 1 }
    ];

    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count > 0) {
            return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
        }
    }

    return "just now";
  
},
calculateDifferenceInMinutes :(startDate)  =>{
  const start = new Date();
  const end = new Date(startDate);
// console.log("start",start);
// console.log("end",end);

  // Difference in milliseconds
  const diffInMs = Math.abs(end - start);

  // Convert milliseconds to minutes
  const diffInMinutes = Math.floor(diffInMs / 60000);

  return diffInMinutes;
  
},
getDomain :()  =>{
  let hostname = window.location.hostname;
  hostname = hostname.replace(/^www\./, "");
  hostname = hostname.replace(/^ag\./, "");
  hostname = hostname.replace(/^msa\./, "");
  hostname = hostname.replace(/^bxawscf\./, "");
  hostname = hostname.replace(/^velki\./, "");
  hostname = hostname.replace(/^aff\./, "");
  return hostname;
}
};

export default obj;
