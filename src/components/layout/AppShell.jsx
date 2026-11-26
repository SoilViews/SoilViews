import { Suspense, useState } from "react";
import { Link as RouterLink, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import Link from "@mui/material/Link";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PersonIcon from "@mui/icons-material/Person";
import SellIcon from "@mui/icons-material/Sell";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useAuth } from "../../context/AuthContext";
import { useThemeMode } from "../../theme/ThemeModeProvider";
import { Role } from "../../constants/roles";
import { signOut } from "../../services/authService";

const DRAWER_WIDTH = 232;

const NAV = [
  { to: "/", key: "nav.home", icon: <HomeIcon />, end: true },
  { to: "/NewOrder", key: "nav.newOrder", icon: <AddLocationAltIcon /> },
  { to: "/MyOrders", key: "MyOrders", icon: <ListAltIcon /> },
  { to: "/Profile", key: "My Profile", icon: <PersonIcon /> },
  { to: "/Pricing", key: "Pricing", icon: <SellIcon /> },
  { to: "/HelpPage", key: "nav.help", icon: <HelpOutlineIcon /> },
  { to: "/About", key: "nav.about", icon: <InfoOutlinedIcon /> },
  { to: "/ContactForm", key: "Contact Us", icon: <MailOutlineIcon /> },
];

export default function AppShell() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, profile } = useAuth();
  const { mode, toggle } = useThemeMode();
  const navigate = useNavigate();

  const items = [...NAV];
  if (profile?.role === Role.Admin) {
    items.push({ to: "/AdminPanel", key: "AdminPanel", icon: <AdminPanelSettingsIcon /> });
  }

  const lang = (i18n.resolvedLanguage || i18n.language || "en").slice(0, 2);
  const handleToggle = () => (isDesktop ? setOpen((o) => !o) : setMobileOpen((o) => !o));
  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const drawerContent = (
    <Box role="navigation" aria-label={t("nav.main")} sx={{ width: DRAWER_WIDTH }}>
      <Toolbar />
      <List>
        {items.map((item) => (
          <ListItemButton
            key={item.to}
            component={NavLink}
            to={item.to}
            end={item.end}
            onClick={() => setMobileOpen(false)}
            sx={{ "&.active": { bgcolor: "action.selected" } }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={t(item.key)} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar position="fixed" sx={{ zIndex: (th) => th.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleToggle} aria-label={t("nav.toggleMenu")} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component={RouterLink} to="/" color="inherit" sx={{ flexGrow: 1, textDecoration: "none" }}>
            SoilViews
          </Typography>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={lang}
            onChange={(_e, v) => v && i18n.changeLanguage(v)}
            aria-label={t("nav.language")}
            sx={{ mr: 1, "& .MuiToggleButton-root": { color: "inherit", borderColor: "rgba(255,255,255,0.5)", py: 0.25 } }}
          >
            <ToggleButton value="en">EN</ToggleButton>
            <ToggleButton value="bg">BG</ToggleButton>
          </ToggleButtonGroup>
          <Tooltip title={t("nav.toggleTheme")}>
            <IconButton color="inherit" onClick={toggle} aria-label={t("nav.toggleTheme")}>
              {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>
          {user ? (
            <Button color="inherit" onClick={handleSignOut}>{t("Log Out")}</Button>
          ) : (
            <Button color="inherit" component={RouterLink} to="/SignIn">{t("Login")}</Button>
          )}
        </Toolbar>
      </AppBar>

      {isDesktop ? (
        <Drawer
          variant="persistent"
          open={open}
          sx={{ width: open ? DRAWER_WIDTH : 0, flexShrink: 0, "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box" } }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} ModalProps={{ keepMounted: true }}>
          {drawerContent}
        </Drawer>
      )}

      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <Toolbar />
        <Box sx={{ flexGrow: 1 }}>
          <Suspense
            fallback={
              <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
                <CircularProgress />
              </Box>
            }
          >
            <Outlet />
          </Suspense>
        </Box>
        <Box component="footer" sx={{ py: 2, px: 3, textAlign: "center", color: "text.secondary", borderTop: 1, borderColor: "divider" }}>
          <Typography variant="body2">
            {t("Created by")}{" "}
            <Link href="https://soilviews.com/" target="_blank" rel="noopener">SoilViews</Link>
            {" · "}
            <Link component={RouterLink} to="/Acknowledgements">{t("Acknowledgements")}</Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
