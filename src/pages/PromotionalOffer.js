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
import { inRange, isEmpty, isNumber } from "lodash";
import AuthContext from "../context/AuthContext";
import obj from "../utils/constants";
import Multiselect from "multiselect-react-dropdown";

const PromotionalOffer = () => {
  const [data, setData] = useState([]);
  const [select, setSelect] = useState("");
  const [filter, setFilter] = useState({});
  const [percent, setPercent] = useState("");
  const [games, setGames] = useState([]);
  const [selectedGames, setSelectedGames] = useState([]);

console.log("games--->",games)
  const getCount = async () => {
    const { data } = await apiGet(pathObj.notificationCount);
    if (data?.success) {
      setSelect(data?.results?.default_agentID);
      setPercent(data?.results?.defualtCommision);
    }
  };

  const getData = async (type) => {
    try {
      const { status, data: response_users } = await apiGet(
        pathObj.getpromotionalOffer,
        {
          type: type,
        }
      );
      if (status === 200) {
        if (response_users.success) {
          startTransition(() => {
            setData(response_users?.results);
            let obj1 = response_users?.results?.data;
            setFilter({
              ...obj1,
              fromPeriod: obj1?.promotal_start_date,
              toPeriod: obj1?.promotal_end_date,
              checked: obj1?.onOff,
              discount: obj1?.promotalDiscount,
              turnover: obj1?.turnover || 0,
              gameSlot: obj1?.gameSlot || 0,
            });
            if (!isEmpty(response_users?.results?.data)) {
              setPercent(response_users?.results?.data?.amount);
            }

            if(obj1?.gameSlot){
              const selectedOption = obj1?.gameSlot.split(",");
              const selectedOptionArray = obj?.gameSlot?.filter(game => selectedOption.includes(game.casinoType)) || [];
               setSelectedGames(selectedOptionArray)
            }

            
          });
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const check = () => {
    if (select == "First_deposit_bonus" || select == "Altime_deposit_bonus") {
      if (percent == 0 || isEmpty(percent)) {
        toast.error("Please enter amount greater than 0 ");
        return false;
      } else if (isEmpty(select)) {
        toast.error("Please select Offer");
        return false;
      } else if (isEmpty(filter?.fromPeriod)) {
        toast.error("Please select from period");
        return false;
      } else if (isEmpty(filter?.toPeriod)) {
        toast.error("Please select to period");
        return false;
      }

      // else if (!inRange(filter?.discount, 0, 100)) {
      //   toast.error("Discount should not be greater than 100");
      //   return false;
      // }
      else {
        return true;
      }
    } else if (
      select == "user_referral_bouns" ||
      select == "weekly_loss_bonus"||
      select == "daily_loss_bonus"||
      select == "monthly_loss_bonus"
    ) {
      if (isEmpty(select)) {
        toast.error("Please select Offer");
        return false;
      } else if (isEmpty(filter?.fromPeriod)) {
        toast.error("Please select from period");
        return false;
      } else if (isEmpty(filter?.toPeriod)) {
        toast.error("Please select to period");
        return false;
      }
      // else if (isEmpty(filter?.bonus)) {
      //   toast.error("Please select bonus");
      //   return false;
      // }
      else {
        return true;
      }
    } else if (select == "slot_game_bonus") {
      if (isEmpty(select)) {
        toast.error("Please select Offer");
        return false;
      } else if (isEmpty(filter?.fromPeriod)) {
        toast.error("Please select from period");
        return false;
      } else if (isEmpty(games)) {
        toast.error("Please select games");
        return false;
      } else if (isEmpty(filter?.toPeriod)) {
        toast.error("Please select to period");
        return false;
      } else if (isEmpty(filter?.gameSlot)) {
        toast.error("Please select GameSlot");
        return false;
      } else if (isEmpty(filter?.use_limit)) {
        toast.error("Please select use limit");
        return false;
      } else if (isEmpty(filter?.amount)) {
        toast.error("Please enter min amount");
        return false;
      } else if (isEmpty(filter?.bonus_available)) {
        toast.error("Please select bonus available");
        return false;
      } else {
        return true;
      }
    } else if (select == "special_date_bonus") {
      if (isEmpty(select)) {
        toast.error("Please select Offer");
        return false;
      } else if (isEmpty(filter?.specialDate)) {
        toast.error("Please select specialDate");
        return false;
      } else if (isEmpty(filter?.minAmount)) {
        toast.error("Please select min amount");
        return false;
      } else if (isEmpty(filter?.deposit_bonus)) {
        toast.error("Please select deposit bonus");
        return false;
      } else if (isEmpty(filter?.turnover)) {
        toast.error("Please select turnover");
        return false;
      } else if (isEmpty(filter?.bonus_turnover)) {
        toast.error("Please select bonus_turnover");
        return false;
      } else {
        return true;
      }
    }
  };
  const onSelectedData = (selectedList, selectedItem) => {
    console.log(selectedList, selectedItem);

    setGames((prev) => {
      return selectedList.map(item => item.casinoType).join()
      
    });
    
  };
  // console.log("------>",games);
  const submit = async () => {
    let isValid = check();
    if (isValid) {
      let firstSecond = {
        type: select,
        amount: percent,
        promotalDiscount: filter?.discount,
        promotal_start_date: filter?.fromPeriod,
        promotal_end_date: filter?.toPeriod,
        onOff: filter?.checked,
        turnover: filter?.turnover,
        bonus_turnover: filter?.bonus_turnover,
      };
      let refralBouns = {
        type: select,
        amount: filter?.amount,
        promotal_start_date: filter?.fromPeriod,
        promotal_end_date: filter?.toPeriod,
        onOff: filter?.checked,
        turnover: filter?.turnover,
        bonus: filter?.bonus,
      };
      let slotGame = {
        type: select,
        gameSlot: games,
        amount: filter?.amount,
        use_limit: filter?.use_limit,
        bonus_available: filter?.bonus_available,
        promotal_start_date: filter?.fromPeriod,
        promotal_end_date: filter?.toPeriod,
        onOff: filter?.checked,
        turnover: filter?.turnover,
      };
      let special_bonus = {
        type: select,
        deposit_bonus: filter?.deposit_bonus,
        bonus_limit: filter?.bonus_limit,
        specialDate: filter?.specialDate,
        minAmount: filter?.minAmount,
        onOff: filter?.checked,
        turnover: filter?.turnover,
        bonus_turnover: filter?.bonus_turnover,
      };
      let arr = {
        First_deposit_bonus: firstSecond,
        Altime_deposit_bonus: firstSecond,
        user_referral_bouns: refralBouns,
        weekly_loss_bonus: refralBouns,
        daily_loss_bonus: refralBouns,
        monthly_loss_bonus: refralBouns,
        slot_game_bonus: slotGame,
        special_date_bonus: special_bonus,
      };
      try {
        const { status, data: response_users } = await apiPost(
          pathObj.promotionalOffer,
          arr[select]
        );
        if (status === 200) {
          if (response_users.success) {
            toast.success(response_users.message);
            setFilter({ fromPeriod: "", toPeriod: "", checked: false });
            setSelect("");
            setPercent("");
          }
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };
  
 
  return (
    <div>
      <section className="set-limit-sec py-4">
        <Container fluid>
          <Row className="align-items-center">
            <Col md={3}>
              <Form.Group className="d-flex align-items-center mb-3  find-member-sec ">
                <Form.Label className="pe-2 mb-0 w-75">
                  Promotional Offer
                </Form.Label>
                <Form.Select
                  value={select}
                  onChange={(e) => {
                    getData(e.target.value);
                    setSelect(e.target.value);
                    setFilter({ fromPeriod: "", toPeriod: "", checked: false });
                  }}
                  aria-label="Default select example w-auto"
                >
                  <option value="">Select Offer</option>
                  <option value="First_deposit_bonus">
                    First deposit bonus
                  </option>
                  <option value="Altime_deposit_bonus">
                    Altime deposit bonus
                  </option>
                  <option value="user_referral_bouns">
                    User Referral Bouns
                  </option>
                  <option value="weekly_loss_bonus">Weekly loss bonus</option>
                  <option value="daily_loss_bonus">Daily loss bonus</option>
                  <option value="monthly_loss_bonus">Monthly loss bonus</option>
                  <option value="slot_game_bonus">Slot Game Bonus</option>
                  <option value="special_date_bonus">Special Date Bonus</option>
                </Form.Select>
              </Form.Group>
            </Col>
            {!isEmpty(select) && select == "special_date_bonus" && (
              <>
                <Col md={2}>
                  <Form.Group className="d-flex align-items-center mb-3 find-member-sec">
                    <Form.Label className="pe-2 mb-0 w-50">
                      Special Date
                    </Form.Label>
                    <Form.Control
                      onChange={(e) =>
                        setFilter({
                          ...filter,
                          specialDate: e.target.value,
                        })
                      }
                      min={new Date().toISOString().split("T")[0]}
                      value={filter?.specialDate}
                      type="date"
                    />
                  </Form.Group>
                </Col>{" "}
                <Col md={3}>
                  <Form.Group className="d-flex align-items-center mb-3  find-member-sec">
                    <Form.Label className="pe-2 mb-0 w-50">
                      Min Amount
                    </Form.Label>
                    <Form.Control
                      value={filter?.minAmount}
                      placeholder="Enter Min Amount"
                      onChange={(e) =>
                        setFilter({
                          ...filter,
                          minAmount: e.target.value,
                        })
                      }
                      aria-label="Default select example w-auto"
                      type="number"
                      min="0"
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="d-flex align-items-center mb-3 find-member-sec">
                    <Form.Label className="pe-2 mb-0 w-50">
                      Bonus Limit
                    </Form.Label>
                    <Form.Select
                      value={filter?.bonus_limit}
                      onChange={(e) => {
                        setFilter({ ...filter, bonus_limit: e.target.value });
                      }}
                      aria-label="Default select example w-auto"
                    >
                      <option value="">Select Bonus</option>
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="d-flex align-items-center mb-3 find-member-sec">
                    <Form.Label className="pe-2 mb-0 w-50">
                      Deposit Bonus (%)
                    </Form.Label>
                    <Form.Control
                      value={filter?.deposit_bonus}
                      placeholder="Enter Turnover"
                      onChange={(e) =>
                        setFilter({
                          ...filter,
                          deposit_bonus: e.target.value,
                        })
                      }
                      aria-label="Default select example w-auto"
                      type="number"
                      min="0"
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="d-flex align-items-center mb-3  find-member-sec">
                    <Form.Label className="pe-2 mb-0 w-50">
                      Turnover(%)
                    </Form.Label>
                    <Form.Control
                      value={filter?.turnover}
                      placeholder="Enter Turnover"
                      onChange={(e) =>
                        setFilter({
                          ...filter,
                          turnover: e.target.value,
                        })
                      }
                      aria-label="Default select example w-auto"
                      type="number"
                      min="0"
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="d-flex align-items-center mb-3  find-member-sec">
                    <Form.Label className="pe-2 mb-0 w-50">
                      Bonus Turnover(%)
                    </Form.Label>
                    <Form.Control
                      value={filter?.bonus_turnover}
                      placeholder="Enter Bonus Turnover"
                      onChange={(e) =>
                        setFilter({
                          ...filter,
                          bonus_turnover: e.target.value,
                        })
                      }
                      aria-label="Default select example w-auto"
                      type="number"
                      min="0"
                    />
                  </Form.Group>
                </Col>
              </>
            )}
            {!isEmpty(select) &&
              (select == "First_deposit_bonus" ||
                select == "Altime_deposit_bonus") && (
                <>
                  <Col md={3}>
                    <Form.Group className="d-flex align-items-center mb-3  find-member-sec">
                      <Form.Label className="pe-2 mb-0 w-50">
                        Min Deposit Amount
                      </Form.Label>
                      <Form.Control
                        value={percent}
                        placeholder="Enter Min Deposit Amount"
                        onChange={(e) => setPercent(e.target.value)}
                        aria-label="Default select example w-auto"
                        type="number"
                        min="0"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="d-flex align-items-center mb-3  find-member-sec">
                      <Form.Label className="pe-2 mb-0 w-50">
                        Turnover(%)
                      </Form.Label>
                      <Form.Control
                        value={filter?.turnover}
                        placeholder="Enter Turnover"
                        onChange={(e) =>
                          setFilter({
                            ...filter,
                            turnover: e.target.value,
                          })
                        }
                        aria-label="Default select example w-auto"
                        type="number"
                        min="0"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Group className="d-flex align-items-center mb-3  find-member-sec">
                      <Form.Label className="pe-2 mb-0 w-50">
                        Bonus (%)
                      </Form.Label>
                      <Form.Control
                        value={filter?.discount}
                        placeholder="Enter bonus"
                        onChange={(e) =>
                          setFilter({
                            ...filter,
                            discount: e.target.value,
                          })
                        }
                        aria-label="Default select example w-auto"
                        type="number"
                        min="0"
                        max="20"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="d-flex align-items-center mb-3  find-member-sec">
                      <Form.Label className="pe-2 mb-0 w-50">
                        Bonus Turnover(%)
                      </Form.Label>
                      <Form.Control
                        value={filter?.bonus_turnover}
                        placeholder="Enter Bonus Turnover"
                        onChange={(e) =>
                          setFilter({
                            ...filter,
                            bonus_turnover: e.target.value,
                          })
                        }
                        aria-label="Default select example w-auto"
                        type="number"
                        min="0"
                      />
                    </Form.Group>
                  </Col>
                </>
              )}
            {!isEmpty(select) &&
              (select == "user_referral_bouns" ||
                select == "weekly_loss_bonus" || select == "daily_loss_bonus" || select == "monthly_loss_bonus") && (
                <>
                  <Col md={3}>
                    <Form.Group className="d-flex align-items-center mb-3 find-member-sec">
                      <Form.Label className="pe-2 mb-0 w-50">
                        {select == "user_referral_bouns"
                          ? "Min Referral Amount"
                          : "Min Loss Amount"}
                      </Form.Label>
                      <Form.Control
                        value={filter?.amount}
                        placeholder="Enter min loss  amount"
                        onChange={(e) =>
                          setFilter({
                            ...filter,
                            amount: e.target.value,
                          })
                        }
                        aria-label="Default select example w-auto"
                        type="number"
                        min="0"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group className="d-flex align-items-center mb-3 find-member-sec">
                      <Form.Label className="pe-2 mb-0 w-50">
                        {select == "user_referral_bouns"
                          ? "Referral Bonus %"
                          : "Loss Bonus %"}
                      </Form.Label>
                      <Form.Control
                        value={filter?.bonus}
                        placeholder="Enter Bonus"
                        onChange={(e) =>
                          setFilter({
                            ...filter,
                            bonus: e.target.value,
                          })
                        }
                        aria-label="Default select example w-auto"
                        type="number"
                        min="0"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="d-flex align-items-center mb-3  find-member-sec">
                      <Form.Label className="pe-2 mb-0 w-50">
                        Turnover(%)
                      </Form.Label>
                      <Form.Control
                        value={filter?.turnover}
                        placeholder="Enter Turnover"
                        onChange={(e) =>
                          setFilter({
                            ...filter,
                            turnover: e.target.value,
                          })
                        }
                        aria-label="Default select example w-auto"
                        type="number"
                        min="0"
                      />
                    </Form.Group>
                  </Col>
                </>
              )}
            {!isEmpty(select) && select == "slot_game_bonus" && (
              <>
                <Col md={3}>
                  <Form.Group className="d-flex align-items-center mb-3  find-member-sec ">
                    <Form.Label className="pe-2 mb-0 w-75">
                      Game Slot
                    </Form.Label>
                    
                      <Multiselect
                                          
                        // onSearch={
                        //   (e) =>
                        //     onSearch(e)
                         
                        // }

                        showArrow={true}
                        options={obj?.gameSlot} 
                        selectedValues={selectedGames}
                        showCheckbox={true}
                        onSelect={(e) =>
                          onSelectedData(e, obj?.gameSlot)
                        } 
                        onRemove={
                          (e) =>
                            onSelectedData(e, obj?.gameSlot)
                         
                        } 
                        displayValue="name" 
                      />

                    {/* <Form.Select
                      as="select"
                      multiple
                      value={games}
                      onChange={(e) =>
                        setGames(
                          [].slice
                            .call(e.target.selectedOptions)
                            .map((item) => item.value)
                        )
                      }
                      aria-label="Default select example w-auto"
                    >
                      <option value="">Select Game</option>
                      {obj?.gameSlot?.map((res) => {
                        return (
                          <option value={res?.casinoType}>{res?.name}</option>
                        );
                      })}
                    </Form.Select> */}
                  </Form.Group>
                </Col>
                {!isEmpty(filter?.gameSlot) && (
                  <>
                    <Col md={2}>
                      <Form.Group className="d-flex align-items-center mb-3 find-member-sec">
                        <Form.Label className="pe-2 mb-0 w-50">
                          Use Limit
                        </Form.Label>
                        <Form.Select
                          value={filter?.use_limit}
                          onChange={(e) => {
                            setFilter({ ...filter, use_limit: e.target.value });
                          }}
                          aria-label="Default select example w-auto"
                        >
                          <option value="">Select Limit</option>
                          {count?.map((res) => {
                            return <option value={res}>{res}</option>;
                          })}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="d-flex align-items-center mb-3 find-member-sec">
                        <Form.Label className="pe-2 mb-0 w-50">
                          Min Turnover
                        </Form.Label>
                        <Form.Control
                          value={filter?.amount}
                          placeholder="Enter Min Turnover"
                          onChange={(e) =>
                            setFilter({
                              ...filter,
                              amount: e.target.value,
                            })
                          }
                          aria-label="Default select example w-auto"
                          type="number"
                          min="1"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="d-flex align-items-center mb-3  find-member-sec">
                        <Form.Label className="pe-2 mb-0 w-50">
                          Turnover(%)
                        </Form.Label>
                        <Form.Control
                          value={filter?.turnover}
                          placeholder="Enter Turnover"
                          onChange={(e) =>
                            setFilter({
                              ...filter,
                              turnover: e.target.value,
                            })
                          }
                          aria-label="Default select example w-auto"
                          type="number"
                          min="0"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="d-flex align-items-center mb-3 find-member-sec">
                        <Form.Label className="pe-2 mb-0 w-50">
                          Bonus Available
                        </Form.Label>
                        <Form.Select
                          value={filter?.bonus_available}
                          onChange={(e) => {
                            setFilter({
                              ...filter,
                              bonus_available: e.target.value,
                            });
                          }}
                          aria-label="Default select example w-auto"
                        >
                          <option value="">Select Bonus Available</option>
                          <option value="single">Single</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="yearly">Yearly</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </>
                )}
              </>
            )}
            {!isEmpty(select) && (
              <>
                {select !== "special_date_bonus" && (
                  <Col md={2}>
                    <Form.Group className="d-flex align-items-center mb-3 find-member-sec">
                      <Form.Label className="pe-2 mb-0 w-25">From</Form.Label>
                      <Form.Control
                        onChange={(e) =>
                          setFilter({
                            ...filter,
                            fromPeriod: e.target.value,
                          })
                        }
                        min={new Date().toISOString().split("T")[0]}
                        value={filter?.fromPeriod}
                        type="date"
                      />
                    </Form.Group>
                  </Col>
                )}
                {select !== "special_date_bonus" && (
                  <Col md={2}>
                    <Form.Group className="d-flex align-items-center mb-3  find-member-sec">
                      <Form.Label className="pe-2 mb-0 w-25">To</Form.Label>
                      <Form.Control
                        onChange={(e) =>
                          setFilter({
                            ...filter,
                            toPeriod: e.target.value,
                          })
                        }
                        min={
                          filter?.fromPeriod
                            ? new Date(filter?.fromPeriod)
                                .toISOString()
                                .split("T")[0]
                            : new Date()
                        }
                        disabled={filter.fromPeriod ? false : true}
                        value={filter?.toPeriod}
                        type="date"
                      />
                    </Form.Group>
                  </Col>
                )}
                <Col md={2}>
                  <Form.Group className="d-flex align-items-center mb-3 find-member-sec">
                    <Form.Label className="pe-2 mb-0 w-50">ON/OFF</Form.Label>
                    <Form.Check
                      type="switch"
                      id="custom-switch"
                      checked={filter?.checked}
                      onClick={(e) => {
                        setFilter({ ...filter, checked: e.target.checked });
                      }}
                    />
                  </Form.Group>{" "}
                </Col>
              </>
            )}
            <Col md={12}>
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

export default PromotionalOffer;

let count = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
];
