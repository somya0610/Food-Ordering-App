import React, { useState } from "react";
import { TextField, InputAdornment, Button } from "@material-ui/core";
import { Fastfood, Search, AccountCircle } from "@material-ui/icons";
import "./Header.css";

const Header = props => {
  const [searchVal, setSearchVal] = useState(null);

  return (
    <header>
      <div className="header-container">
        <div className="header-logo">
          <Fastfood />
        </div>
        <div className="header-search">
          <TextField
            id="input-with-icon-textfield"
            placeholder="Search by Restaurant Name"
            variant="filled"
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
          />
        </div>
        <div className="header-action">
          <Button className="header-login">
            <AccountCircle /> Login
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
