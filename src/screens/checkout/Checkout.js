import React, { Component } from "react";
import "./Checkout.css";
import Header from "../../common/header/Header";
import {
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  Divider,
  AppBar,
  Tabs,
  Tab,
  Box,
  Grid,
  IconButton,
  Snackbar,
} from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CloseIcon from '@material-ui/icons/Close';
import { getAddressCustomer, getStates } from "../../common/api/Address";
import { placeOrder } from "../../common/api/Order";
import { green } from "@material-ui/core/colors";
import PropTypes from "prop-types";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}

class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accessToken: localStorage.getItem("access-token"),
      activeStep: 0,
      addressList: [],
      stateList: [],
      checkoutSummary: JSON.parse(sessionStorage.getItem("checkoutSummary")),
      tabValue: 0,
      selectedAddress: null,
      showMessage: false,
      message: ''
    };
  }

  componentDidMount() {
    this.fetchAddressCustomer();
    console.log(this.state.checkoutSummary);
  }

  fetchAddressCustomer = () => {
    console.log(this.state.accessToken);
    getAddressCustomer(this.state.accessToken)
      .then(response => {
        if (response && response.addresses.length) {
          this.setState(
            {
              addressList: response.addresses
            },
            () => {
              this.getAllStates();
            }
          );
        }
        console.log("response fetching restaurant", response);
      })
      .catch(error => {
        console.log("error in fetching restaurant");
      });
  };

  getAllStates = () => {
    getStates()
      .then(response => {
        console.log("response fetching states", response);
        if (response && response.states && response.states.length) {
          this.setState({
            stateList: response.states
          });
        }
      })
      .catch(error => {
        console.log("error in fetching states");
      });
  };

  handleStepper = val => {
    this.setState({
      activeStep: this.state.activeStep + val
    });
  };

  handleChange = (event, newValue) => {
    this.setState({
      tabValue: newValue
    });
  };

  selectAddress = address => {
    this.setState({
      selectedAddress: address
    });
  };

  /** Handler to place customer's order */
  placeOrderClickHandler = () => {
    let itemAdded = this.state.checkoutSummary.itemsAddedForOrder;
    let order = [];
    itemAdded.forEach(item => {
      let orderItem = {
        item_id: item.id,
        price: item.price,
        quantity: item.quantity
      };
      order.push(orderItem);
    })
    let reqBody = {
      address_id: 'a73444b6-8016-4aac-90f0-2582f420c69d',//selectedAddress.id,
      bill: this.state.checkoutSummary.totalAmount,
      coupon_id: null,
      discount: 0,
      item_quantities: order,
      payment_id: '2ddf63b0-ecd0-11e8-8eb2-f2801f1b9fd1',//payment id
      restaurant_id: this.state.checkoutSummary.restaurantId
    };

    placeOrder(reqBody, this.state.accessToken)
      .then(response => {
        if (response && response.id) {
          this.setState({
            showMessage: true,
            message: 'Order placed successfully! Your order ID is ' + response.id + '.'
          })
        } else {
          this.setState({
            showMessage: true,
            message: 'Unable to place your order! Please try again!'
          })
        }
      })
      .catch(error => {
        console.log("error while placing the order", error);
      });
  }

  /** Handler to close snackbar */
  closeSnackBarHandler = () => {
    this.setState({
      showMessage: false,
      message: ''
    })
  }

  render() {
    const {
      activeStep,
      addressList,
      tabValue,
      stateList,
      selectedAddress
    } = this.state;
    return (
      <div>
        {/** Header component included here */}
        <Header />

        {/** Snackbar added to show item is added/ removed from cart */}
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          open={this.state.showMessage}
          autoHideDuration={5000}
          onClose={this.closeSnackBarHandler}
          message={this.state.message}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.closeSnackBarHandler}>
              <CloseIcon />
            </IconButton>
          ]}
          className="details-snackbar"
        ></Snackbar>

        {/** Checkout section starts here */}
        <div className="checkout-container">
          {/** Delivery and Payment section starts here */}
          <div className="address-payment-container">
            <Stepper activeStep={activeStep} orientation="vertical">
              <Step key="Delivery">
                <StepLabel>Delivery</StepLabel>
                <StepContent>
                  <AppBar position="static">
                    <Tabs
                      value={tabValue}
                      onChange={this.handleChange}
                      aria-label="simple tabs example"
                      className="tabs"
                    >
                      <Tab label="EXISTING ADDRESS" {...a11yProps(0)} />
                      <Tab label="NEW ADDRESS" {...a11yProps(1)} />
                    </Tabs>
                  </AppBar>
                  <TabPanel value={tabValue} index={0}>
                    <div className="address-container">
                      {addressList.length ? (
                        <Grid container>
                          {addressList.map(address => {
                            return (
                              <Grid
                                item
                                className={`address-card ${selectedAddress &&
                                  selectedAddress.id === address.id
                                  ? "active"
                                  : ""
                                  }`}
                                xs={6}
                                sm={6}
                                md={4}
                                lg={4}
                              >
                                <div>{address.flat_building_name}</div>
                                <div>{address.locality}</div>
                                <div>{address.city}</div>
                                <div>{address.state.state_name}</div>
                                <div>{address.pincode}</div>
                                <div className="check-icon">
                                  <IconButton
                                    aria-label="delete"
                                    // disabled
                                    onClick={() => this.selectAddress(address)}
                                  // color="greem"
                                  >
                                    {selectedAddress &&
                                      selectedAddress.id === address.id ? (
                                      <CheckCircleIcon
                                        style={{ color: "#098000" }}
                                      />
                                    ) : (
                                      <CheckCircleIcon />
                                    )}
                                  </IconButton>
                                </div>
                              </Grid>
                            );
                          })}
                        </Grid>
                      ) : (
                        <div className="no-address-msg">
                          There are no saved addresses! You can save an address
                          using the 'New Address' tab or using your ‘Profile’
                          menu option.
                        </div>
                      )}
                      <div className="button-actions">
                        <Button
                          disabled={true}
                          // onClick={()=>this.handleBack()}
                          className="back-button"
                        >
                          BACK
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            if (selectedAddress && selectedAddress.id) {
                              this.handleStepper(1);
                            }
                          }}
                          className="next-button"
                        >
                          NEXT
                        </Button>
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel value={tabValue} index={1}>
                    Item Two
                  </TabPanel>
                </StepContent>
              </Step>
              <Step key="Payment">
                <StepLabel>Payment</StepLabel>
                <StepContent>
                  Payment
                  <div className="button-actions">
                    <Button
                      // disabled={true}
                      onClick={() => this.handleStepper(-1)}
                      className="back-button"
                    >
                      BACK
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => this.handleStepper(1)}
                      className="next-button"
                    >
                      FINISH
                    </Button>
                  </div>
                </StepContent>
              </Step>
            </Stepper>
            {activeStep === 2 ? (
              <div className="view-summary">
                View the summary & place your order now!
                <Button
                  // disabled={true}
                  onClick={() => this.handleStepper(-2)}
                // className="back-button"
                >
                  CHANGE
                </Button>
              </div>
            ) : (
              ""
            )}
          </div>
          {/** Delivery and Payment section ends here */}

          {/** Delivery and Order summary section starts here */}
          <div className="summary-container">
            <Card>
              <CardContent>
                <Typography variant="body1">Summary</Typography>
                <Typography variant="body1">
                  {this.state.checkoutSummary.restaurantName}
                </Typography>
                {this.state.checkoutSummary &&
                  this.state.checkoutSummary.itemsAddedForOrder.length > 0 ? (
                  <List>
                    {this.state.checkoutSummary.itemsAddedForOrder.map(item => (
                      <ListItem key={"item_" + item.id}>
                        <div className="checkout-item-section1">
                          {item.type === "VEG" ? (
                            <i className="far fa-stop-circle" aria-hidden="true" style={{ color: "#138313" }} />
                          ) : (
                            <i className="far fa-stop-circle" aria-hidden="true" style={{ color: "#c30909" }} />
                          )}
                          <span className="checkout-item-name">
                            {item.name.replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>
                        <div className="checkout-item-section2">
                          <span className="checkout-item-name">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="checkout-item-section3">
                          <span className="checkout-item-price">
                            <i className="fa fa-rupee-sign" aria-hidden="true" style={{ color: "grey" }} />{" "}
                            {item.price.toFixed(2)}
                          </span>
                        </div>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  ""
                )}
                <Divider />
                <div className="checkout-net-amount">
                  <Typography variant="body1">Net Amount</Typography>
                  <Typography variant="body1">
                    <i className="fa fa-rupee-sign" aria-hidden="true"></i>{" "}
                    {this.state.checkoutSummary.totalAmount.toFixed(2)}
                  </Typography>
                </div>
                <Button variant="contained" color="primary" className="order-button"
                  onClick={this.placeOrderClickHandler}>
                  PLACE ORDER
                </Button>
              </CardContent>
            </Card>
          </div>
          {/** Delivery and Order summary section endss here */}
        </div>
        {/** Checkout section ends here */}
      </div>
    );
  }
}

export default Checkout;