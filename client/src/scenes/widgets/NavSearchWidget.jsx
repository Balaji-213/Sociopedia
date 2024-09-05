import { useState, useEffect, Fragment } from "react";
import {
  TextField,
  Autocomplete,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import {
  Search,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const NavSearchWidget = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const [selectedOption, setSelectedOption] = useState(null); // State to store the selected option

  const handleOptionSelect = (event, selectedOption) => {
    setSelectedOption(selectedOption);
    navigate(`/profile/${selectedOption.id}`)
    console.log(selectedOption);
  };

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  useEffect(() => {
    if (inputValue === '') {
      setOptions([]);
      return;
    }

    setLoading(true);

    const fetchOptions = async () => {
      try {

        const response = await fetch(`http://localhost:3001/users/search/${inputValue}`,{
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const userOptions = data.map(user => ({
          id: user.id,
          fullName: `${user.firstName} ${user.lastName}`
        }));
        setOptions(userOptions);
      } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [inputValue,token]);

  return (

    <Autocomplete
      id="asynchronous-demo"
      sx={{ width: 300 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      forcePopupIcon={false}
      filterOptions={(x) => x}
      isOptionEqualToValue={(option, value) => option.fullName === value.fullName}
      getOptionLabel={(option) => option.fullName}
      options={options}
      loading={loading}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      onChange={handleOptionSelect}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search..."
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                <InputAdornment position="end">
                  <Search />
                </InputAdornment>
                {params.InputProps.endAdornment}
              </Fragment>
            ),
          }}
          
        />
        
      )}
    />


    
    );

};

export default NavSearchWidget;
