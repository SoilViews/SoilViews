import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

// Centered card used by all form pages.
export default function FormCard({ title, children, maxWidth = 440, component = "form", onSubmit, ...rest }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", px: 2, py: { xs: 3, md: 6 } }}>
      <Card sx={{ width: "100%", maxWidth }} elevation={3}>
        <CardContent
          component={component}
          onSubmit={onSubmit}
          noValidate
          sx={{ display: "flex", flexDirection: "column", gap: 2, p: { xs: 2, sm: 4 } }}
          {...rest}
        >
          {title && (
            <Typography variant="h4" component="h1" align="center" color="primary">
              {title}
            </Typography>
          )}
          {children}
        </CardContent>
      </Card>
    </Box>
  );
}
