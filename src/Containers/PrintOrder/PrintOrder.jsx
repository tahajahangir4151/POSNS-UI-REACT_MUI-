import React, { Component } from "react";
import moment from "moment";

export default class PrintOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItems: props.selectedItems,
  
    };
  }

  render() {
    const {
      selectedItems,
      orderNo,
      isEditMode,
      tablesList,
      selectedTable,
      remarks,
      noOfGuests,
      kot
    } = this.props;

    const selectedTableDetails =
      tablesList &&
      tablesList.data.find((item) => {
        return item.tableCode === selectedTable;
      });
    return (
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <b>{kot} </b>
        </div>
        <hr />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isEditMode ? "Running Order" : "New Order"}&nbsp; -&nbsp;
          {moment().format("L")}&nbsp;:&nbsp;{moment().format("LT")}
        </div>
        <hr />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Order No:{" "}
          {isEditMode
            ? selectedItems && selectedItems.length && selectedItems[0].scono
            : orderNo}
          &nbsp;:&nbsp;
          {isEditMode
            ? selectedItems &&
              selectedItems.length &&
              selectedItems[0].tableName
            : selectedTableDetails
            ? selectedTableDetails.name
            : ""}
        </div>
        <hr />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Captain Name: {this.props.loggedInUserName}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          No of Guests: {noOfGuests}
        </div>
        <hr />
        <div
          style={{
            display: "flex",
            alignItems: "left",
            justifyContent: "left",
          }}
        >
          Remarks: {remarks}
        </div>
        <hr />
        <hr />
        <div
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <table>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Item Name </th>
                <th></th>
                <th style={{ textAlign: "left" }}>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {selectedItems ? (
                isEditMode ? (
                  selectedItems.map((item) => {
                    // console.log("UpdatedItems", item.updatedQuantity);

                    return item.updatedQuantity ? (
                      <tr key={item.id}>
                        <td style={{ textAlign: "left" }}>{item.name}</td>
                        <td></td>
                        <td style={{ textAlign: "center" }}>
                          {item.updatedQuantity}
                        </td>
                      </tr>
                    ) : (
                      <></>
                    );
                  })
                ) : (
                  selectedItems.map((item) => {
                    return (
                      <tr key={item.id}>
                        <td style={{ textAlign: "left" }}>{item.name}</td>
                        <td></td>
                        <td style={{ textAlign: "center" }}>{item.quantity}</td>
                      </tr>
                    );
                  })
                )
              ) : (
                <></>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
