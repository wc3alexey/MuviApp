import React from 'react';

import { Layout, Input } from 'antd';

const { Header } = Layout;

const MuviHeader = ({ onInputChange }) => (
  <Header>
    <Input placeholder="Type to search..." onChange={onInputChange} />
  </Header>
);
export default MuviHeader;