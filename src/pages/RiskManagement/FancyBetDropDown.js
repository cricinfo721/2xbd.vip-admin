import React from "react";

const FancyBetDropDown = ({ showMatch }) => {
  return (
    showMatch && (
      <tr>
        <td colSpan="3" className="px-0 gray-table">
          <table className="selection-table">
            <tbody className="">
              <tr>
                <td width="40%" className="text-start border-0 ">
                  3 selections Selections
                </td>
                <td className="refer-bet border-0" colSpan="2" width="30%">
                  100.8%
                </td>
                <td className="border-0 p-0" width="15%">
                  <div className="back-blue back-all-size">
                    <span>Back all</span>
                  </div>
                </td>
                <td className="border-0 p-0" width="15%">
                  <div className="lay-all back-all-size">
                    <span>Lay all</span>
                  </div>
                </td>
                <td className="refer-book border-0" colSpan="2" id="layPercent">
                  99.5%
                </td>
              </tr>
              <tr>
                <td className="border-start-0">
                  <a href="#">
                    {" "}
                    <i className="far fa-chart-bar pe-2"></i>
                    <strong> Warwickshire</strong>
                  </a>
                </td>
                <td className="back-3 p-0">
                  <div className="light-blue rounded-0">
                    <strong>2.82</strong>
                    <span className="d-block">1.43</span>
                  </div>
                </td>
                <td className="back-2 p-0">
                  <div className="middle-blue rounded-0">
                    <strong>3.15</strong>
                    <span className="d-block">15.42</span>
                  </div>
                </td>
                <td className="back-1 p-0">
                  <div className="back-blue rounded-0">
                    <strong>3.2</strong>
                    <span className="d-block">99</span>
                  </div>
                </td>
                <td className="lay-1 p-0">
                  <div className="lay-all rounded-0">
                    <strong>5.7</strong>
                    <span className="d-block">24.84</span>
                  </div>
                </td>
                <td className="lay-2 p-0">
                  <div className="dark-pink rounded-0">
                    <strong>5.9</strong>
                    <span className="d-block">1.79</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border-start-0">
                  <a href="#">
                    {" "}
                    <i className="far fa-chart-bar pe-2"></i>
                    <strong> Warwickshire</strong>
                  </a>
                </td>
                <td className="back-3 p-0">
                  <div className="light-blue rounded-0">
                    <strong>2.82</strong>
                    <span className="d-block">1.43</span>
                  </div>
                </td>
                <td className="back-2 p-0">
                  <div className="middle-blue rounded-0">
                    <strong>3.15</strong>
                    <span className="d-block">15.42</span>
                  </div>
                </td>
                <td className="back-1 p-0">
                  <div className="back-blue rounded-0">
                    <strong>3.2</strong>
                    <span className="d-block">99</span>
                  </div>
                </td>
                <td className="lay-1 p-0">
                  <div className="lay-all rounded-0">
                    <strong>5.7</strong>
                    <span className="d-block">24.84</span>
                  </div>
                </td>
                <td className="lay-2 p-0">
                  <div className="dark-pink rounded-0">
                    <strong>5.9</strong>
                    <span className="d-block">1.79</span>
                  </div>
                </td>
              </tr>

              <tr>
                <td className="border-start-0">
                  <a href="#">
                    {" "}
                    <i className="far fa-chart-bar pe-2"></i>
                    <strong> Warwickshire</strong>
                  </a>
                </td>
                <td className="back-3 p-0">
                  <div className="light-blue rounded-0">
                    <strong>2.82</strong>
                    <span className="d-block">1.43</span>
                  </div>
                </td>
                <td className="back-2 p-0">
                  <div className="middle-blue rounded-0">
                    <strong>3.15</strong>
                    <span className="d-block">15.42</span>
                  </div>
                </td>
                <td className="back-1 p-0">
                  <div className="back-blue rounded-0">
                    <strong>3.2</strong>
                    <span className="d-block">99</span>
                  </div>
                </td>
                <td className="lay-1 p-0">
                  <div className="lay-all rounded-0">
                    <strong>5.7</strong>
                    <span className="d-block">24.84</span>
                  </div>
                </td>
                <td className="lay-2 p-0">
                  <div className="dark-pink rounded-0">
                    <strong>5.9</strong>
                    <span className="d-block">1.79</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
        <td width="80" className="border-l"></td>
      </tr>
    )
  );
};

export default FancyBetDropDown;
