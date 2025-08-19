import React from "react";

export const FancyListDropdown = ({
  showMatch,
  data,
  selectData,
  res,
  title,
  fancyOdds,
}) => {
  return (
    showMatch && (
      <tr key={data[0]?.runnerName}>
        <td></td>
        <td></td>
        <td>{data[0]?.runnerName}</td>
        <td className="back-3 p-0" style={{ cursor: "not-allowed" }}>
          <div className="light-blue rounded-0">
            <strong>
              {fancyOdds && fancyOdds.length > 0 && fancyOdds[0]?.rt
                ? fancyOdds[0]?.rt
                : "--"}
            </strong>
            <span className="d-block">
              {fancyOdds && fancyOdds.length > 0 && fancyOdds[0]?.pt
                ? fancyOdds[0]?.pt
                : "--"}
            </span>
          </div>
        </td>
        <td></td>
        <td className="lay-2 p-0" style={{ cursor: "not-allowed" }}>
          <div className="dark-pink rounded-0">
            <strong>
              {fancyOdds && fancyOdds.length > 0 && fancyOdds[1]?.rt
                ? fancyOdds[1]?.rt
                : "--"}
            </strong>
            <span className="d-block">
              {fancyOdds && fancyOdds.length > 0 && fancyOdds[1]?.pt
                ? fancyOdds[1]?.pt
                : "--"}
            </span>
          </div>
        </td>

        <td width="80" className="border-l"></td>
      </tr>
    )
  );
};
