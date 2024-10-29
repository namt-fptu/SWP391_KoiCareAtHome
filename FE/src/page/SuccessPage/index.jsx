import React from 'react';
import { Result, Button } from 'antd';

const SuccessPage = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Result
        status="success"
        title={<span style={{ color: '#4CAF50' }}>Payment Successfully!</span>} // Change color for title
        subTitle={<span style={{ color: '#757575' }}>Thank you for buying our package.</span>} // Change color for subtitle
        extra={[
          <Button type="primary" key="console">
            View Details
          </Button>,          
        ]}
      />
    </div>
  );
};

export default SuccessPage;