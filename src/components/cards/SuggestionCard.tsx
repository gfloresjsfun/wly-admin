// types
import { SuggestionCardProps } from 'types/suggestions';

// project import
import MainCard from 'components/MainCard';
import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Stack,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useMemo } from 'react';

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 2
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 2
  }
};

const SuggestionCard: React.FC<SuggestionCardProps> = ({ item: { title, description, playables, tips }, onDelete }) => {
  const playableElms = useMemo(
    () =>
      playables.map(({ playable }) => (
        <Card sx={{ position: 'relative', m: 1 }}>
          <CardMedia image={playable.coverS3Url} component="img" />
          <Box sx={{ width: '100%', position: 'absolute', bottom: 0, padding: 2.5 }}>
            <Typography color="white" variant="h6">
              {playable.title}
            </Typography>
          </Box>
        </Card>
      )),
    [playables]
  );

  const tipElms = useMemo(
    () =>
      tips?.map((tip) => (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
            <Typography>{tip.summary}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{tip.details}</Typography>
          </AccordionDetails>
        </Accordion>
      )),
    [tips]
  );

  return (
    <MainCard content={false} boxShadow>
      <CardHeader title={title} />
      <CardContent sx={{ paddingTop: 0 }}>
        <Stack gap={2}>
          <Typography variant="body1" color="text.secondary">
            {description}
          </Typography>
          <Carousel responsive={responsive}>{playableElms}</Carousel>
          <Stack>{tipElms}</Stack>
        </Stack>
      </CardContent>
    </MainCard>
  );
};

export default SuggestionCard;
