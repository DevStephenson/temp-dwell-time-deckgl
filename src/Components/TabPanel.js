import React from "react";
import PropTypes from "prop-types";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Fade from "@material-ui/core/Fade";
import Slide from "@material-ui/core/Slide";

export default function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Fade
            // direction={index % 2 === 0 ? "right" : "left"}
            in={value === index}
            timeout={900}
            mountOnEnter
            unmountOnExit
          >
            <Typography>{children}</Typography>
          </Fade>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
