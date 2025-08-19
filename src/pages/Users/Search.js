import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
const Search = (props) => {
  const [keyword, setKeyword] = useState();
  const [status, setStatus] = useState();

  const handleClick = () => {
    props.onSubmit({
      keyword,
      status,
    });
  };

  useEffect(() => {
    if (props.reset) {
      document.getElementById("searchForm").reset();
      setKeyword("");
      setStatus("active");
    }
  }, [props]);

  useEffect(() => {
    handleClick();
  }, [status]);

  return (
    <Form id={"searchForm"}>
      <Form.Group className="position-relative">
        <Form.Control
          type="text"
          placeholder="Find member..."
          onChange={(e) => {
            setKeyword(e.target.value);
          }}
        />
        <i className="fas fa-search"></i>
        <Button className="search-btn" onClick={handleClick}>
          Search
        </Button>
      </Form.Group>
      <Form.Group className="d-flex align-items-center ps-2">
        <Form.Label className="pe-3 mb-0">Status</Form.Label>
        <Form.Select
          aria-label="Default select example"
          onChange={(e) => {
            setStatus(e.target.value);
          }}
        >
          <option value="active">Active</option>
          <option value="suspend">Suspend</option>
          <option value="locked">Locked</option>
          <option value="">All</option>
        </Form.Select>
      </Form.Group>
    </Form>
  );
};

export default Search;
