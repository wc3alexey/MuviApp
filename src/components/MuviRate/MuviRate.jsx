import React from 'react';
import { Content } from 'antd/lib/layout/layout';

import { GenresListConsumer } from '../MuviList/MuviList';
import MuviCard from '../MuviCard/MuviCard';

const MuviRate = ({ rateList, changeRateList }) => (
  <Content>
    <GenresListConsumer>
      {(genresList) => {
        return rateList.map((item) => {
          const { id } = item;
          return <MuviCard item={item} key={id} genresList={genresList} changeRateList={changeRateList} />;
        });
      }}
    </GenresListConsumer>
  </Content>
);

export default MuviRate;