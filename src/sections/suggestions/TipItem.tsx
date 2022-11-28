// react
import { useState } from 'react';
// mui
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Collapse, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
// custom
import TipForm from './TipForm';
// types
import { ITip } from 'types/suggestions';

interface TipItemProps {
  item: ITip;
  onDelete: () => void;
  onSave: (tip: ITip) => void;
}

const TipItem: React.FC<TipItemProps> = ({ item, onDelete, onSave }) => {
  const [tipFormOpen, setTipFormOpen] = useState(false);
  const handleTipFormCancel = () => {
    setTipFormOpen(false);
  };

  return (
    <>
      <Collapse in={tipFormOpen}>
        <TipForm initialValues={item} onSubmit={onSave} onCancel={handleTipFormCancel} />
      </Collapse>

      {!tipFormOpen && (
        <Accordion>
          <AccordionSummary>{item.summary}</AccordionSummary>
          <AccordionDetails>{item.details}</AccordionDetails>
          <AccordionActions>
            <IconButton aria-label="edit" color="primary" size="small" onClick={() => setTipFormOpen(true)}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton aria-label="delete" color="error" size="small" onClick={onDelete}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </AccordionActions>
        </Accordion>
      )}
    </>
  );
};

export default TipItem;
