import React from 'react';
import { Result, Button } from 'antd';

const FailurePage = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Result
        status="error"
        title={<span style={{ color: '#F44336' }}>Payment Failed!</span>} // Change color for title to red
        subTitle={<span style={{ color: '#757575' }}>Sorry, something went wrong with your payment.</span>} // Subtitle
        extra={[
          <Button type="primary" key="retry">
            Retry Payment
          </Button>,
        ]}
      />
    </div>
  );
};

export default FailurePage;
