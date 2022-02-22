import React, { Component } from 'react';

import apiServise from '../../services/ApiServise';
import MuviCard from '../MuviCard/MuviCard';
import MuviSpin from '../MuviSpin/MuviSpin';

import { GenresListConsumer } from '../MuviList/MuviList';

import { Alert } from 'antd';
import { Pagination } from 'antd';
import { Content } from 'antd/lib/layout/layout';

import { debounce } from 'lodash';

export default class AntSearchContent extends Component {
  state = {
    moviesList: [],
    loading: false,
    error: false,
    notFound: false,
    totalPages: null,
  };

  getList = (searchQuery, numberPage) => {
    apiServise
      .getMovies(searchQuery, numberPage)
      .then((res) => {
        this.setState({
          moviesList: [...res.list],
          loading: false,
          error: false,
          totalPages: res.totalPages,
        });
      })
      .then(() => {
        if (this.state.moviesList.length === 0) {
          this.setState({
            notFound: true,
          });
        }
      })
      .catch(this.onError);
  };

  debouncedGetList = debounce(this.getList, 500);

  onError = () => {
    this.setState({
      error: true,
      loading: false,
    });
  };

  componentDidUpdate(perevProps) {
    const { searchQuery, numberPage } = this.props;

    if (searchQuery !== perevProps.searchQuery || numberPage !== perevProps.numberPage) {
      this.setState({
        loading: true,
        error: false,
        notFound: false,
      });
      this.debouncedGetList(searchQuery, numberPage);
    }
  }

  render() {
    const { moviesList, loading, error, notFound, totalPages } = this.state;

    const { searchQuery, numberPage, onPageChange, changeRateList, rateList } = this.props;

    const errorMessage =
      error && searchQuery !== '' ? (
        <Alert message="Error" description="Oops, something went wrong :-(" type="error" showIcon />
      ) : null;

    const onNotFound =
      !error && !loading && notFound ? (
        <Alert message="No results were found for your search!" type="info" showIcon />
      ) : null;

    const spinner = loading ? <MuviSpin /> : null;

    const content = !(loading || error) ? (
      <GenresListConsumer>
        {(genresList) => {
          return (
            <React.Fragment>
              {moviesList.map((item) => {
                const { id } = item;
                return (
                  <MuviCard
                    item={item}
                    key={id}
                    genresList={genresList}
                    changeRateList={changeRateList}
                    rateList={rateList}
                  />
                );
              })}
            </React.Fragment>
          );
        }}
      </GenresListConsumer>
    ) : null;


    const quickJumper = totalPages > 5 ? true : false;
    const total = totalPages * 10; 

    const onPagination =
      moviesList.length !== 0 && searchQuery !== '' && !loading ? (
        <Pagination
          size="small"
          showQuickJumper={quickJumper}
          defaultCurrent={numberPage}
          total={total}
          onChange={onPageChange}
          showSizeChanger={false}
        ></Pagination>
      ) : null;

    return (
      <React.Fragment>
        <Content>
          {spinner}
          {content}
          {errorMessage}
          {onNotFound}
        </Content>
        {onPagination}
      </React.Fragment>
    );
  }
}
