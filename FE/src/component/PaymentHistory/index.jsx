import React, { useState, useEffect } from "react";
import { Table, message, Select } from "antd";
import api from "../../config/axios";
import { useAuthStore } from "../../page/(auth)/store";

const { Option } = Select;

const PaymentHistory = () => {
  const [advertisements, setAdvertisements] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const { authUser } = useAuthStore();
  const shopId = authUser.id;

  // Fetch advertisements by Shop ID
  useEffect(() => {
    if (!shopId) {
      message.error("User not logged in. Unable to fetch advertisements.");
      return;
    }

    const fetchAdvertisements = async () => {
      try {
        const advResponse = await api.get(`/Adv/getAdvByShopId/${shopId}`);
        setAdvertisements(advResponse.data);
      } catch (error) {
        console.error("Error fetching advertisements:", error);
      }
    };

    fetchAdvertisements();
  }, [shopId]);

  // Fetch payment history by Advertisement ID
  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const paymentPromises = advertisements.map(async (adv) => {
          try {
            const paymentResponse = await api.get(`/Payment/getPaymentByAdvId/${adv.id}`);
            return paymentResponse.data;
          } catch (error) {
            if (error.response && error.response.status === 404) {
              console.warn(`No payment history found for advertisement ID: ${adv.id}`);
              return null;
            } else {
              throw error;
            }
          }
        });
  
        const paymentData = (await Promise.all(paymentPromises)).filter(Boolean);
        setPaymentHistory(paymentData.flat());
      } catch (error) {
        console.error("Error fetching payment history:", error);
      }
    };
  
    if (advertisements.length > 0) {
      fetchPaymentHistory();
    }
  }, [advertisements]);

  // Sorting Function
  const handleSortChange = (value) => {
    const sortedData = [...paymentHistory].sort((a, b) => {
      if (value === "newest") {
        return new Date(b.payDate) - new Date(a.payDate);
      } else {
        return new Date(a.payDate) - new Date(b.payDate);
      }
    });
    setPaymentHistory(sortedData);
  };

  // Columns for the Table
  const columns = [
    {
      title: 'ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
    },
    {
      title: 'Payment Date',
      dataIndex: 'payDate',
      key: 'payDate',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Success',
      dataIndex: 'success',
      key: 'success',
      render: (success) => (success ? "Yes" : "No"),
    },
  ];

  return (
    <div className="p-5 bg-gray-900 min-h-screen">
      <h2 className="text-white text-3xl font-bold mb-5">Payment History</h2>
      
      {/* Sort Filter */}
      <div className="mb-4">
        <Select
          defaultValue="newest"
          style={{ width: 200 }}
          onChange={handleSortChange}
        >
          <Option value="newest">Newest to Oldest</Option>
          <Option value="oldest">Oldest to Newest</Option>
        </Select>
      </div>

      <Table
        columns={columns}
        dataSource={paymentHistory}
        rowKey="transactionId"
        pagination={{ pageSize: 5 }}
        className="bg-gray-800 text-white"
      />
    </div>
  );
};

export default PaymentHistory;
