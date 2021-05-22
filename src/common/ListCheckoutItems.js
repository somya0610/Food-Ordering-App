import React, { Component } from 'react';
import {
  List,
  ListItem,
  IconButton,
} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

/** Class component to create List of Items added in the checkout cart in Details page
 * This compoment can be reused in Checkout page to display items selected in summary section
 */
class ListCheckoutItems extends Component {

  render() {
    return (
      /** List compoment starts here */
      <List>
        {this.props.itemsAdded.map(item => (
          <ListItem key={'item1_' + item.id}>
            <div className={this.props.page + "-item-section1"}>
              {item.type === "VEG" ?
                <i className="far fa-stop-circle" aria-hidden="true" style={{ color: "#138313" }}></i>
                :
                <i className="far fa-stop-circle" aria-hidden="true" style={{ color: "#c30909" }}></i>}
              <span className={this.props.page + "-item-name"}>
                {item.name.replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
            <div className={this.props.page + "-item-section2"}>
              {this.props.page === "details" ?
                <div className="details-minus-section">
                  <IconButton onClick={() => this.props.removeItemHandler(item)} style={{ color: "black" }}>
                    <RemoveIcon className="details-cart-icon" fontSize="small" />
                  </IconButton>
                </div>
                : ""}
              <span className={this.props.page + "-item-name"}>{item.quantity}</span>
              {this.props.page === "details" ?
                <div className="details-plus-section">
                  <IconButton onClick={() => this.props.addItemHandler(item, true)} style={{ color: "black" }}>
                    <AddIcon className="details-cart-icon" fontSize="small" />
                  </IconButton>
                </div>
                : ""}
            </div>
            <div className={this.props.page + "-item-section3"}>
              <span className={this.props.page + "-item-price"}>
                <i className="fa fa-rupee-sign" aria-hidden="true"></i> {item.price.toFixed(2)}
              </span>
            </div>
          </ListItem>
        ))}
      </List>
      /** List compoment ends here */
    )
  }
}

export default ListCheckoutItems;