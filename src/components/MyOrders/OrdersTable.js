import React from "react";
import OrdersSummary from "../Admin/OrdersSummary";

const OrdersTable = (props) => {
  const { orders } = props;
  return (
    <div className="row project-lists">
      {orders &&
        orders.map((order) => {
          return <OrdersSummary order={order} />;
        })}
    </div>
  );
};

export default OrdersTable;
