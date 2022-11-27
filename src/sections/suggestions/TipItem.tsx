import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ITip } from 'types/suggestions';

const TipItem: React.FC<{ item: ITip & { id: string }; onDelete: () => void }> = ({ item: { summary, details }, onDelete }) => {
  return (
    <Accordion>
      <AccordionSummary>{summary}</AccordionSummary>
      <AccordionDetails>{details}</AccordionDetails>
      <AccordionActions>
        <IconButton aria-label="edit" color="primary" size="small">
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton aria-label="delete" color="error" size="small">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </AccordionActions>
    </Accordion>
  );
};

export default TipItem;
