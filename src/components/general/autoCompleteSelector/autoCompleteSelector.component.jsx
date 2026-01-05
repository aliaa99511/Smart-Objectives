import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useLocation, useNavigate } from "react-router-dom";

function AutoCompleteSelector({
  allSearchItems,
  typeOfSelectedItem,
  placeholder,
  name,
  dependentSelectedInputToReset,
  useSessionStorage = false,
  onSelectionChange = null,
  initialValue = null,
  disableClearable = false,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // Get value from URL or session storage based on the flag
  const getInitialValue = () => {
    if (useSessionStorage) {
      return sessionStorage.getItem(typeOfSelectedItem);
    } else {
      return searchParams.get(typeOfSelectedItem);
    }
  };

  const selectedSearchItemId = initialValue || getInitialValue();

  const [value, setValue] = useState(null); //options[0]
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (selectedSearchItemId) {
      const selectedItem = allSearchItems?.find(
        (searchItem) => searchItem.Id == selectedSearchItemId
      );
      const getTitleForSelectedSearchItem = selectedItem?.Title;
      setValue(getTitleForSelectedSearchItem);
    } else {
      //reset depending inputs
      if (
        dependentSelectedInputToReset &&
        dependentSelectedInputToReset.length > 0
      ) {
        dependentSelectedInputToReset.forEach((depend) => {
          if (useSessionStorage) {
            sessionStorage.removeItem(depend);
          } else {
            // If cleared, remove the specific query parameter
            searchParams.delete(depend);
            // Update the URL with the new or removed query parameter
            navigate(`?${searchParams.toString()}`, { replace: true });
          }
        });
      }

      // Clear the current selection
      if (useSessionStorage) {
        sessionStorage.removeItem(typeOfSelectedItem);
      } else {
        // If cleared, remove the specific query parameter
        searchParams.delete(typeOfSelectedItem);
        navigate(`?${searchParams.toString()}`, { replace: true });
      }

      setValue(null);
    }
  }, [selectedSearchItemId, allSearchItems]);

  const handleSelection = (event, newValue) => {
    setValue(newValue);

    const selectedItem = newValue
      ? allSearchItems?.find((searchItem) => searchItem.Title == newValue)
      : null;

    const getIdForSelectedSearchItem = selectedItem?.Id;

    const selectedId = getIdForSelectedSearchItem || "";

    // Store the selection based on the storage type
    if (useSessionStorage) {
      if (selectedId) {
        sessionStorage.setItem(typeOfSelectedItem, selectedId);
      } else {
        sessionStorage.removeItem(typeOfSelectedItem);
      }
    } else {
      // Replace the existing query parameter with the selected value
      const newSearchParams = new URLSearchParams(location.search);
      if (selectedId) {
        newSearchParams.set(typeOfSelectedItem, selectedId);
      } else {
        newSearchParams.delete(typeOfSelectedItem);
      }
      navigate(`?${newSearchParams.toString()}`, { replace: true });
    }

    // Call the callback if provided
    if (onSelectionChange) {
      onSelectionChange(selectedId);
    }
  };

  return (
    <Autocomplete
      name={name}
      className="autoCompleteComponent"
      fullWidth={true}
      value={value}
      onChange={handleSelection}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      id="controllable-states-demo"
      options={allSearchItems?.map((option) => option?.Title) || []}
      renderInput={(params) => (
        <TextField {...params} placeholder={placeholder} />
      )}
      disableClearable={disableClearable}
    />
  );
}

export default AutoCompleteSelector;
