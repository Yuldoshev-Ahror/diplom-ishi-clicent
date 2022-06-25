import { useEffect } from "react";
import React from "react";
import { numberToPrice } from "../libs/numberToPrice";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import NativeSelect from "@material-ui/core/NativeSelect";
import InputBase from "@material-ui/core/InputBase";

const BootstrapInput = withStyles((theme) => ({
  root: {
    "label + &": {
      marginTop: theme.spacing(3),
    },
    width: "100%",
  },
  input: {
    borderRadius: 4,
    position: "relative",
    backgroundColor: "#fff",
    border: "1px solid #ced4da",
    fontSize: 16,

    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    padding: "8px 26px 8px 12px!important",
    "&:focus": {
      backgroundColor: "#fff",
      borderRadius: 4,
      borderColor: "#f5363e",
      boxShadow: "none",
    },
  },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

export default function BranchDialog({
  nearest_dealer,
  delivery_price,
  branches,
  delivery_type,
  changeBranchId,
  branch_id,
  addressRef,
}) {
  const handleChange = (event) => {
    changeBranchId(event.target.value);
  };

  // console.log(branches)
  return (
    <div className={`dialog_wrapper`} ref={addressRef}>
      <div className={`dialog_info`}>
        <div className={`dialog_info_item`}>
          <p>Ближайший филиал :</p>
          {delivery_type === "self-pickup" ? (
            <p>
              <NativeSelect
                input={<BootstrapInput />}
                value={branch_id}
                onChange={handleChange}
              >
                {branches.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.name}
                  </option>
                ))}
              </NativeSelect>
            </p>
          ) : (
            <p>{nearest_dealer && nearest_dealer.name}</p>
          )}
        </div>
        <div className={`dialog_info_item`}>
          <p>Адрес :</p>
          <p>{nearest_dealer && nearest_dealer.address}</p>
        </div>
        <div className={`dialog_info_item`}>
          <p>Телефон :</p>
          <p>{nearest_dealer && nearest_dealer.phone}</p>
        </div>
        <div className={`dialog_info_item`}>
          <p>Сумма доставки :</p>
          <p>{numberToPrice(delivery_price)}</p>
        </div>
      </div>
    </div>
  );
}
