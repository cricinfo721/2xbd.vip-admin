import React, {
  startTransition,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { toast } from "wc-toast";
import { apiGet, apiPost } from "../utils/apiFetch";
import pathObj from "../utils/apiPath";
import { isEmpty, isNumber } from "lodash";
import AuthContext from "../context/AuthContext";
const DefaultAgent = () => {
  const [data, setData] = useState([]);
  const [select, setSelect] = useState("");
  const { agentId } = useContext(AuthContext);
  const getCount = async () => {
    const { data } = await apiGet(pathObj.notificationCount);
    if (data?.success) {
      setSelect(data?.results?.default_agentID);
      setPercent(data?.results?.defualtCommision)
    }
  };
  const getData = async () => {
    try {
      const { status, data: response_users } = await apiGet(pathObj.agentList);
      if (status === 200) {
        if (response_users.success) {
          startTransition(() => {
            setData(response_users?.results);
            getCount();
          });
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const submit = async (id) => {
    if (percent > 50) {
      toast.error("Please enter commision below 50% ");
    } else {
      try {
        const { status, data: response_users } = await apiPost(
          pathObj.saveDefaultAgent,
          { agentId: id, defualtCommision: percent }
        );
        if (status === 200) {
          if (response_users.success) {
            toast.success(response_users.message);
          }
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const [percent, setPercent] = useState("");
  return (
    <div>
      <section className="set-limit-sec py-4">
        <Container fluid>
          <Row className="align-items-center">
            <Col md={3}>
              <Form.Group className="d-flex align-items-center mb-3  find-member-sec ">
                <Form.Label className="pe-2 mb-0 w-75">
                  Default Agent
                </Form.Label>
                <Form.Select
                  value={select}
                  defaultValue={agentId}
                  onChange={(e) => setSelect(e.target.value)}
                  aria-label="Default select example w-auto"
                >
                  <option value="">Select Agent</option>
                  {data?.length > 0 &&
                    data?.map((res) => {
                      return <option value={res?._id}>{res?.username}</option>;
                    })}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="d-flex align-items-center mb-3  find-member-sec ">
                <Form.Label className="pe-2 mb-0 w-75">
                  Default Commision
                </Form.Label>
                <Form.Control
                  value={percent}
                  placeholder="Default Commision"
                  onChange={(e) => setPercent(e.target.value)}
                  aria-label="Default select example w-auto"
                  type="number"
                  min="0"
                  max="50"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Button
                onClick={() => {
                  if (!isEmpty(select)) {
                    submit(select);
                  } else {
                    toast.error("Please select agent");
                  }
                }}
                className="btn btn-primary"
              >
                Submit
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default DefaultAgent;
