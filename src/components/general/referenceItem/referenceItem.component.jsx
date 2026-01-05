import { IconButton } from "@mui/material";
import styles from "./referenceItem.module.css";
import { RiDeleteBin4Fill } from "react-icons/ri";

const ReferenceItem = ({ refrence, handleRemoveReference, index }) => {
  return (
    <div className={styles.referenceItem}>
      <a
        href={refrence}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.referenceLink}
      >
        {refrence}
      </a>
      {handleRemoveReference && (
        <IconButton
          size="small"
          onClick={() => handleRemoveReference(index)}
          className={styles.deleteButton}
        >
          <RiDeleteBin4Fill />
        </IconButton>
      )}
    </div>
  );
};

export default ReferenceItem;
