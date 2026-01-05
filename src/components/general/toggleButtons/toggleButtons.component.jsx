import React, { useEffect, useState } from "react";
import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./toggleButtons.module.css";

function ToggleButtons({
  options,
  typeOfSelectedItem,
  defaultValue,
  name,
  dependentSelectedInputToReset,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedValue = searchParams.get(typeOfSelectedItem) || defaultValue;

  const [value, setValue] = useState(selectedValue);

  useEffect(() => {
    if (selectedValue) {
      setValue(selectedValue);
    } else {
      // Set default value if none is selected
      if (defaultValue) {
        const newSearchParams = new URLSearchParams(location.search);
        newSearchParams.set(typeOfSelectedItem, defaultValue);
        navigate(`?${newSearchParams.toString()}`, { replace: true });
      } else {
        // Reset depending inputs if any
        if (
          dependentSelectedInputToReset &&
          dependentSelectedInputToReset.length > 0
        ) {
          dependentSelectedInputToReset.forEach((depend) => {
            searchParams.delete(depend);
          });
        }

        // Remove the parameter if no default
        searchParams.delete(typeOfSelectedItem);
        navigate(`?${searchParams.toString()}`, { replace: true });
      }
    }
  }, [selectedValue, defaultValue, location.search]);

  const handleChange = (event, newValue) => {
    if (newValue !== null) {
      setValue(newValue);

      // Update URL with the new selection
      const newSearchParams = new URLSearchParams(location.search);
      newSearchParams.set(typeOfSelectedItem, newValue);

      // Reset dependent inputs if specified
      if (
        dependentSelectedInputToReset &&
        dependentSelectedInputToReset.length > 0
      ) {
        dependentSelectedInputToReset.forEach((depend) => {
          newSearchParams.delete(depend);
        });
      }

      navigate(`?${newSearchParams.toString()}`, { replace: true });
    }
  };

  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={handleChange}
      aria-label={name}
      className={styles.toggleGroup}
    >
      {options.map((option) => (
        <ToggleButton
          key={option.value}
          value={option.value}
          aria-label={option.label}
          className={styles.toggleButton}
        >
          {option.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

export default ToggleButtons;
