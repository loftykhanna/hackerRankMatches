
import React, { Component } from "react";
import "./index.css";
import fetch from 'isomorphic-unfetch';
const classNames = require('classnames');

export default class FootballMatchesData extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedYear: null,
      result : {}
    };
  }

  componentDidUpdate(_prevProps, prevState) {
  // Typical usage (don't forget to compare props):
  console.log('test', this.state.selectedYear, prevState.selectedYear)
  // Dont make the api call for same year, sort of memoize - not proper, can be improved
  if (this.state.selectedYear !== prevState.selectedYear && !prevState.result[this.state.selectedYear]) {
    console.log('year changed', this.state.selectedYear, );
    this.fetchData();
  }
}


fetchData = () =>{
fetch(`https://jsonmock.hackerrank.com/api/football_competitions?year=${this.state.selectedYear || 2011}`)
  .then( r => r.json() )
  .then( data => {
    console.log(data);
    this.setState({
      result: {...this.state.result, [this.state.selectedYear] : data.data}
    })
  });
}
  onClick = (year) => (e) => {
    // Code written in next line is to take care of adding active class to selected year for css purpose.
    this.setState({
      selectedYear: year
    })
  }

  wonMatchUI = (year) =>{
      return this.state.result[year].map((value)=>{
        const {winner = '', name='' } = value;
          return <li className="slide-up-fade-in" key={name}>Match {name} won by {winner}</li>
      })
  }

  render() {
    const isdataAvalilable = this.state.result && this.state.result[this.state.selectedYear] && this.state.result[this.state.selectedYear];
    const totalMatches = isdataAvalilable && this.state.result[this.state.selectedYear].length 
    var years= [2011, 2012, 2013, 2014, 2015, 2016, 2017];
    return (
      <div className="layout-row">
        <div className="section-title">Select Year</div>
        <ul className="sidebar" data-testid="year-list">
          {years.map((year, i) => {
            return (
              <li className={
                classNames({
                  'sidebar-item': true,
                  'active': this.state.selectedYear === year
                })
              }
              onClick={this.onClick(year)}
              key={year}>
                <a>{year}</a>
              </li>
            )
          })}
        </ul>

        <section className="content">
          <section>
  {this.state.selectedYear && isdataAvalilable && totalMatches!=0  && (<div className="total-matches" data-testid="total-matches"> Total matches: {totalMatches} </div>) }
            
            { this.state.selectedYear &&  isdataAvalilable && <ul className="mr-20 matches styled" data-testid="match-list">
             { this.state.result[this.state.selectedYear] && this.wonMatchUI(this.state.selectedYear)}
            </ul>}
          </section>

          { this.state.selectedYear && totalMatches == 0 && <div data-testid="no-result" className="slide-up-fade-in no-result">No Matches Found</div>}
        </section>
      </div>
    );
  }
}