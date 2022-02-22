import React, { Component } from 'react';


import { GenresListProvider } from './components/MuviList/MuviList';
import MuviHeader from './components/MuviHeader/MuviHeader';
import MuviSearch from './components/MuviSearch/MuviSearch';
import MuviRated from './components/MuviRate/MuviRate';

import apiServise from './services/ApiServise';

import { Layout } from 'antd';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

export default class App extends Component {
  state = {
    searchQuery: null,
    numberPage: 1,
    genresList: [],
    rateList: [],
  };

  componentDidMount() {
    console.log(1)
    apiServise.getGenres().then((list) => {
      this.setState({
        genresList: [...list],
      });
    });
    if (!JSON.parse(localStorage.getItem('guestToken'))) {
      apiServise.creatGuestSession().then((guestToken) => {
        localStorage.setItem('guestToken', JSON.stringify(guestToken));
      });
    } else {
      this.changeRateList();
    }
  }

  onInputChange = (e) => {
    this.setState({
      searchQuery: e.target.value,
      numberPage: 1,
    });
  };

  onPageChange = (page) => {
    this.setState({
      numberPage: page,
    });
  };

  changeRateList = () => {
    apiServise.getRatedFilms().then((res) => {
      this.setState({
        rateList: [...res.results], 
      });
    });
  };

  onTabClick = (key) => {
    this.changeRateList();
  };

  render() {
    const { searchQuery, numberPage, genresList, rateList } = this.state;
    return (
      <GenresListProvider value={genresList}>
        <div className="container">
          <Layout>
            <Tabs defaultActiveKey="1" onTabClick={this.onTabClick}>
              <TabPane tab="Search" key="1">
                <MuviHeader onInputChange={this.onInputChange} />
                <MuviSearch
                  searchQuery={searchQuery}
                  numberPage={numberPage}
                  onPageChange={this.onPageChange}
                  changeRateList={this.changeRateList}
                  rateList={rateList}
                />
              </TabPane>
              <TabPane tab="Rated" key="2">
                <MuviRated rateList={rateList} changeRateList={this.changeRateList} />
              </TabPane>
            </Tabs>
          </Layout>
        </div>
      </GenresListProvider>
    );
  }
}
