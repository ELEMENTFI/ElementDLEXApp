import React, { Component } from 'react';
import Chart from 'react-apexcharts';
import { Col, Row } from 'react-bootstrap';
import {calltokenForUsers,callapiforuserslist} from '../apicallfunction';

// const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

class Area extends Component {
    constructor(props) {
        super(props);
        this.state = {
            series1: [
              {
                  name: "",
                  data: [146, 184, 178, 192, 166]
              }
            ],
            series2: [
              {
                  name: "",
                  data: [146, 184, 178, 192, 166]
              }
            ],
            options1: {
                chart: {
                    height: 350,
                    type: 'area',
                    toolbar: {
                    show: false
                    },
                    stroke: {
                        curve: 'straight'
                    },
                    zoom: {
                        enabled: false
                    }
                },
                colors: ['rgba(213, 145, 255, 0.7)'],
                dataLabels: {
                    enabled: false,
                },
                stroke: {
                    curve: 'smooth',
                    width: 1,
                },
                tooltip: {
                    theme: 'dark',
                    shared: true
                },
                title: {
                    text: '',
                    align: 'left'
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shadeIntensity: 1,
                        inverseColors: false,
                        opacityFrom: 0.45,
                        opacityTo: 0.05,
                        stops: [20, 100, 100, 100]
                      },
                  },
                grid: {
                    borderColor: 'rgba(255,255,255,0.2)',
                    row: {
                    colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
                    opacity: 1
                    },
                    xaxis: {
                      lines: {
                          show: false
                      }
                    },   
                    yaxis: {
                        lines: {
                            show: false
                        }   
                    },  
                },
                markers: {
                    size: 0
                },
                xaxis: {
                    categories: ['15', '13', '18', '10', '60'],
                    title: false,
                    labels: {
                        show: false,
                        style:{
                            colors: '#AAAAAA'
                        }
                    }
                },
                yaxis: {
                    title: false,
                    labels: {
                        show: false,
                        formatter: function (value) {
                            return value.toLocaleString() + ".00"
                        },
                        style:{
                            colors: '#AAAAAA'
                        }
                    }
                },
                legend: {
                    show: false
                }
            },
            options2: {
                chart: {
                    height: 350,
                    type: 'area',
                    toolbar: {
                    show: false
                    },
                    stroke: {
                        curve: 'straight'
                    },
                    zoom: {
                        enabled: false
                    }
                },
                colors: ['rgba(213, 145, 255, 0.7)'],
                dataLabels: {
                    enabled: false,
                },
                stroke: {
                    curve: 'straight',
                    width: 1,
                },
                tooltip: {
                    theme: 'dark',
                    shared: true
                },
                title: {
                    text: '',
                    align: 'left'
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shadeIntensity: 1,
                        inverseColors: false,
                        opacityFrom: 0.45,
                        opacityTo: 0.05,
                        stops: [20, 100, 100, 100]
                      },
                  },
                grid: {
                    borderColor: 'rgba(255,255,255,0.2)',
                    row: {
                    colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
                    opacity: 1
                    },
                    xaxis: {
                      lines: {
                          show: false
                      }
                    },   
                    yaxis: {
                        lines: {
                            show: false
                        }   
                    },  
                },
                markers: {
                    size: 0
                },
                xaxis: {
                    categories: ['15', '13', '18', '10', '60'],
                    title: false,
                    labels: {
                        show: false,
                        style:{
                            colors: '#AAAAAA'
                        }
                    }
                },
                yaxis: {
                    title: false,
                    labels: {
                        show: false,
                        formatter: function (value) {
                            return value.toLocaleString() + ".00"
                        },
                        style:{
                            colors: '#AAAAAA'
                        }
                    }
                },
                legend: {
                    show: false
                }
            }           
        };
    }
  calvalue =async()=>{
    const d1 = await calltokenForUsers();
    let tv =0 ;
    d1.map(async(v,r2)=>{
      // console.log("d1",v)
      tv = parseFloat(tv) + parseFloat(v.tvl);
    });
    
    console.log("tvl",tv)
 }
    // componentDidUpdate(nextProps){
    //     if(nextProps.xaxis !== this.props.xaxis){
    //         setTimeout(() => {
    //             this.setState({
    //                 series: [
    //                     {
    //                         data: this.props.series
    //                     }
    //                 ],
    //                 options: {
    //                     xaxis:{
    //                         categories: this.props.xaxis
    //                     }
    //                 }
    //             })
    //         }, 100);
    //     }
    // }
    
    render() {
        return (
            (typeof window !== 'undefined') &&
                <Row>
                    <Col md={12} className='mb-20'>
                        <div className="card-base p-0 card-dark card-analytic">
                            <div className="card-analytic-head d-flex justify-content-between align-items-center">
                                <div className="d-flex flex-column">
                                    <span>Liquidity</span>
                                    <div className="h3 m-0">${(localStorage.getItem("tvl")/1000000).toFixed(3) > 0 ? (localStorage.getItem("tvl")/1000000).toFixed(3):'0.0'}</div>
                                    {/* <small className='date'>Dec 29, '21</small> */}
                                </div>

                                <ul className="chart-filter mb-0 d-flex align-items-center list-unstyled">
                                    <li>1W</li>
                                    <li>1M</li>
                                    <li>All</li>
                                </ul>
                            </div>
                            <Chart
                                options={this.state.options1}
                                series={this.state.series1}
                                type="area"
                                height={350}
                            />
                        </div>
                    </Col>

                    {/* <Col md={6} className='mb-20'>
                        <div className="card-base p-0 card-dark card-analytic">
                            <div className="card-analytic-head d-flex justify-content-between align-items-center">
                                <div className="d-flex flex-column">
                                    <span>PRICE</span>
                                    <div className="h3 m-0">$71,521,053.60</div>
                                    
                                </div>

                                <ul className="chart-filter mb-0 d-flex align-items-center list-unstyled">
                                    <li>1W</li>
                                    <li>1M</li>
                                    <li>All</li>
                                </ul>
                            </div>
                            <Chart
                                options={this.state.options2}
                                series={this.state.series2}
                                type="area"
                                height={350}
                            />
                        </div>
                    </Col> */}
                </Row>
        );
    }
}

export default Area