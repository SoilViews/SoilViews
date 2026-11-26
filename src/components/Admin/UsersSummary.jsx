import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

// Stat card: a label with a big count.
export default function StatCard({ id, label, count, icon }) {
  return (
    <Card variant="outlined" sx={{ flex: 1, minWidth: 160 }}>
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {icon}
        <div>
          <Typography variant="h4" component="p" data-testid={`count-${id}`} color="primary">
            {count}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
}
