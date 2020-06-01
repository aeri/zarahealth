import React, { useState } from "react";
import { IconButton, Slider, Typography } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Button } from "@material-ui/core";
import { DateTime, Duration } from "luxon";
import ScheduleIcon from "@material-ui/icons/Schedule";
import { useLazyQuery } from "@apollo/react-hooks";

function DateFilterButton(props) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [range, setRange] = useState([-new Date().getHours(), 0]);
  const [fetchNewData, { data }] = useLazyQuery(props.query);

  var currentDate = new Date();

  var firstDate = DateTime.fromJSDate(currentDate).minus(
    Duration.fromMillis(-1 * range[0] * 1000 * 60 * 60)
  );

  var finalDate = DateTime.fromJSDate(currentDate).minus(
    Duration.fromMillis(-1 * range[1] * 1000 * 60 * 60)
  );

  return (
    <div>
      <Dialog
        open={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Filtrar por fechas"}
        </DialogTitle>

        <DialogContent>
          <Typography>
            {"Selecciona el periodo de tiempo en el que quieres visuliazar los datos de " +
              props.name}
          </Typography>
          <br />
          <Typography variant="h6">desde</Typography>
          <Typography>{firstDate.toFormat("dd/MM/yyyy HH:") + "00"}</Typography>
          <br />
          <Typography variant="h6">hasta</Typography>
          <Typography>{finalDate.toFormat("dd/MM/yyyy HH:") + "00"}</Typography>
          <Slider
            value={range}
            max={0}
            min={-96}
            onChange={(event, newValue) => setRange(newValue)}
          />
          <Button
            onClick={() => {
              fetchNewData({
                variables: {
                  startDate: firstDate.toISO(),
                  endDate: finalDate.toISO(),
                  [props.idFieldName]: props.id,
                },
              });
            }}
            fullWidth
            variant="contained"
            color="primary"
          >
            {"Aplicar filtro"}
          </Button>
        </DialogContent>
      </Dialog>

      <IconButton onClick={() => setDialogOpen(true)}>
        <ScheduleIcon style={{ fill: "white" }} />
      </IconButton>
    </div>
  );
}

export default DateFilterButton;
