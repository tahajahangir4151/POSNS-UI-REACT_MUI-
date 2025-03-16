import React from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Divider,
  useMediaQuery,
  makeStyles,
  CircularProgress,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import PaidIcon from "@material-ui/icons/AttachMoney";
import DiscountIcon from "@material-ui/icons/LocalOffer";
import { useSelector } from "react-redux";
import SimpleBackdrop from "../../Components/Loader";

const useStyles = makeStyles((theme) => ({
  salesCard: {
    padding: theme.spacing(2),
    backgroundColor: "#C4F0B6",
    borderRadius: theme.shape.borderRadius,
    height: "100%",
    position: "relative",
    transition: "all 0.3s ease",
    border: "2px solid transparent",
  },
  discountCard: {
    padding: theme.spacing(2),
    backgroundColor: "#C9DDFD",
    borderRadius: theme.shape.borderRadius,
    height: "100%",
    position: "relative",
    transition: "all 0.3s ease",
    border: "2px solid transparent",
  },
  ordersCard: {
    padding: theme.spacing(2),
    backgroundColor: "#FFD4AA",
    borderRadius: theme.shape.borderRadius,
    height: "100%",
    position: "relative",
    transition: "all 0.3s ease",
    border: "2px solid transparent",
  },
}));

const DashboardCards = ({ data }) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isLoading = useSelector((state) => state.user.isFetching);

  // Discounts breakdown
  const discBreakdown = [
    { label: "Restaurant", orders: data?.totalOtherDisc || 0 },
    { label: "Owner", orders: data?.totalOwnerDisc || 0 },
    { label: "Complimentary", orders: data?.totalComplimentary || 0 },
  ];

  //Calculate total Discount
  const totalDiscount =
    data?.totalOtherDisc ||
    0 + data?.totalOwnerDisc ||
    0 + data?.totalComplimentary ||
    0;

  // Render Discount breakdown in the specified order
  const renderDiscBreakdown = () => {
    return discBreakdown.map(({ label, orders }) => (
      <Box key={label} style={{ marginBottom: 8, padding: 8 }}>
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 4,
            transition: "all 0.3s ease",
          }}
        >
          <Typography
            variant="body2"
            style={{
              color: "#152D5E",
              textTransform: "capitalize",
              fontWeight: 700,
              fontSize: isMobile ? "1rem" : "0.875rem",
            }}
          >
            {label}
          </Typography>
          <Typography
            variant="body2"
            style={{
              color: "#152D5E",
              fontSize: isMobile ? "1rem" : "0.875rem",
            }}
          >
            {orders}
          </Typography>
        </Box>
      </Box>
    ));
  };

  // Orders breakdown
  const ordersBreakdown = [
    { label: "Food Panda", orders: data?.totalFPOrders || 0 },
    { label: "Dastak", orders: data?.totalDastakOrders || 0 },
    { label: "Take-Aways", orders: data?.totalTAOrders || 0 },
    { label: "Deliveries", orders: data?.totalDelivOrders || 0 },
    { label: "Dine-in", orders: data?.totalDineInOrders || 0 },
  ];

  // Render orders breakdown in the specified order
  const renderOrdersBreakdown = () => {
    return ordersBreakdown.map(({ label, orders }) => (
      <Box key={label} style={{ marginBottom: 8, padding: 8 }}>
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 4,
            transition: "all 0.3s ease",
          }}
        >
          <Typography
            variant="body2"
            style={{
              color: "#7E521F",
              textTransform: "capitalize",
              fontWeight: 700,
              fontSize: isMobile ? "1rem" : "0.875rem",
            }}
          >
            {label}
          </Typography>
          <Typography
            variant="body2"
            style={{
              color: "#7E521F",
              fontSize: isMobile ? "1rem" : "0.875rem",
            }}
          >
            {orders}
          </Typography>
        </Box>
      </Box>
    ));
  };

  // Sales breakdown
  const tCashSale = data?.totalCashSale || 0;
  const tCreditCardSale = data?.totalCrSale || 0;
  const tRecievSales = data?.totalReceivables || 0;
  const tCompSales = data?.totalComplimentary || 0;

  // Calculate total, GST and net amount
  const totalWithoutGST =
    tCashSale + tCreditCardSale + tRecievSales + tCompSales;
  const tSaleExclgst = (data?.totalSale || 0) - (data?.totalGST || 0);

  //Calculate Average/Cover
  const avgCover = (data?.totalSale || 0) / (data?.totalNoOfCover || 0);
  // console.log(avgCover)

  // Render sales breakdown with separate entries for each category
  const renderSalesBreakdown = () => {
    const salesItems = [
      { label: "Cash Sale", amount: tCashSale },
      { label: "Credit Card Sale", amount: tCreditCardSale },
      { label: "Receivables", amount: tRecievSales },
      { label: "Complimentary", amount: tCompSales },
    ];

    return salesItems.map(({ label, amount }) => (
      <Box key={label} style={{ marginBottom: 8, padding: 8 }}>
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 4,
            transition: "all 0.3s ease",
          }}
        >
          <Typography
            variant="body1"
            style={{
              color: "#1F5D0C",
              textTransform: "capitalize",
              fontWeight: 700,
              whiteSpace: "nowrap",
              // fontSize: isMobile ? "1rem" : "0.875rem",
              flex: 1,
            }}
          >
            {label}
          </Typography>
          <Typography
            variant="body2"
            style={{
              color: "#1F5D0C",
              fontSize: isMobile ? "1rem" : "0.875rem",
              flex: 0.5,
              textAlign: "center",
            }}
          >
            {Math.round((amount / totalWithoutGST) * 100) || 0}%
          </Typography>
          <Typography
            variant="body2"
            style={{
              color: "#1F5D0C",
              fontSize: isMobile ? "1rem" : "0.875rem",
              flex: 1,
              textAlign: "right",
            }}
          >
            {Math.round(amount).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
        </Box>
      </Box>
    ));
  };

  if (isLoading) {
    return <SimpleBackdrop />;
  }

  return (
    <Grid container spacing={2} style={{ padding: isMobile ? 8 : 16 }}>
      {/* Sales Card  */}
      <Grid
        item
        xs={12}
        md={6}
        lg={4}
        style={{ marginBottom: isMobile ? 16 : 0 }}
      >
        <Paper elevation={0} className={classes.salesCard}>
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 16,
            }}
          >
            <Box>
              <Typography
                variant="subtitle2"
                style={{
                  color: "#548F40",
                  marginBottom: 8,
                  fontWeight: 500,
                  fontSize: isMobile ? "1.5rem" : "1rem",
                }}
              >
                Total Sales
              </Typography>
              <Typography
                variant="h4"
                style={{
                  color: "#548F40",
                  fontWeight: 600,
                  fontSize: isMobile ? "1.8rem" : "2.125rem",
                }}
              >
                {Math.round(data?.totalSale || 0).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>
            </Box>
            <PaidIcon
              style={{
                color: "#1976D2",
                fontSize: isMobile ? "1.8rem" : "2rem",
              }}
            />
          </Box>
          <Divider style={{ margin: "16px 0" }} />
          <Box>{renderSalesBreakdown()}</Box>
          <Divider style={{ margin: "16px 0" }} />
          {/* Sales Summary */}
          <Box style={{ padding: 8 }}>
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <Typography
                variant="body2"
                style={{ color: "#1F5D0C", fontWeight: 700 }}
              >
                GST Amount
              </Typography>
              <Typography
                variant="body2"
                style={{
                  color: "#1F5D0C",
                  fontSize: isMobile ? "1rem" : "0.875rem",
                }}
              >
                {Math.round(data?.totalGST || 0).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>
            </Box>
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "1rem",
              }}
            >
              <Typography
                variant="body2"
                style={{ color: "#1F5D0C", fontWeight: 700 }}
              >
                Amount Excl. GST
              </Typography>
              <Typography
                variant="body2"
                style={{
                  color: "#1F5D0C",
                  fontSize: isMobile ? "1rem" : "0.875rem",
                }}
              >
                {Math.round(tSaleExclgst).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>
            </Box>
            <Divider style={{ margin: "16px 0", marginTop: "20px" }} />
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <Typography
                variant="body2"
                style={{ color: "#1F5D0C", fontWeight: 700 }}
              >
                Total No. of covers{" "}
              </Typography>
              <Typography
                variant="body2"
                style={{
                  color: "#1F5D0C",
                  fontSize: isMobile ? "1rem" : "0.875rem",
                }}
              >
                {data?.totalNoOfCover || 0}
              </Typography>
            </Box>
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "1rem",
              }}
            >
              <Typography
                variant="body2"
                style={{ color: "#1F5D0C", fontWeight: 700 }}
              >
                Avg. / cover{" "}
              </Typography>
              <Typography
                variant="body2"
                style={{
                  color: "#1F5D0C",
                  fontSize: isMobile ? "1rem" : "0.875rem",
                }}
              >
                {Math.round(avgCover || 0).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>

      {/* Discount Card */}
      <Grid
        item
        xs={12}
        md={6}
        lg={4}
        style={{
          marginBottom: isMobile ? 16 : 0,
          marginTop: isMobile ? "10px" : "5px",
        }}
      >
        <Paper elevation={0} className={classes.discountCard}>
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 16,
            }}
          >
            <Box>
              <Typography
                variant="subtitle2"
                style={{
                  color: "#152D5E",
                  marginBottom: 8,
                  fontWeight: 500,
                  fontSize: isMobile ? "1.5rem" : "1rem",
                }}
              >
                Discounts
              </Typography>
              <Typography
                variant="h4"
                style={{
                  color: "#152D5E",
                  fontWeight: 600,
                  fontSize: isMobile ? "1.8rem" : "2.125rem",
                }}
              >
                {Math.round(totalDiscount || 0).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
              </Typography>
            </Box>
            <DiscountIcon
              style={{
                color: "#79859A",
                fontSize: isMobile ? "1.8rem" : "2rem",
              }}
            />
          </Box>
          <Divider style={{ margin: "16px 0" }} />
          <Box>{renderDiscBreakdown()}</Box>
        </Paper>
      </Grid>

      {/* Orders Card */}
      <Grid
        item
        xs={12}
        md={6}
        lg={4}
        style={{
          marginBottom: isMobile ? 16 : 0,
          marginTop: isMobile ? "10px" : "5px",
        }}
      >
        <Paper elevation={0} className={classes.ordersCard}>
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 16,
            }}
          >
            <Box>
              <Typography
                variant="subtitle2"
                style={{
                  color: "#724610",
                  marginBottom: 8,
                  fontWeight: 500,
                  fontSize: isMobile ? "1.5rem" : "1rem",
                }}
              >
                Total Orders
              </Typography>
              <Typography
                variant="h4"
                style={{
                  color: "#724610",
                  fontWeight: 600,
                  fontSize: isMobile ? "1.8rem" : "2.125rem",
                }}
              >
                {data?.totalOrders || 0}
              </Typography>
            </Box>
            <ShoppingCartIcon
              style={{
                color: "#FF5800",
                fontSize: isMobile ? "1.8rem" : "2rem",
              }}
            />
          </Box>
          <Divider style={{ margin: "16px 0" }} />
          <Box>{renderOrdersBreakdown()}</Box>
          <Divider style={{ margin: "16px 0" }} />
          <Box style={{ marginBottom: 8, padding: 8 }}>
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 4,
                transition: "all 0.3s ease",
              }}
            >
              <Typography
                variant="body2"
                style={{
                  color: "#7E521F",
                  textTransform: "capitalize",
                  fontWeight: 700,
                  fontSize: isMobile ? "1rem" : "0.875rem",
                }}
              >
                Cancelled Orders
              </Typography>
              <Typography
                variant="body2"
                style={{
                  color: "#7E521F",
                  fontSize: isMobile ? "1rem" : "0.875rem",
                }}
              >
                {data?.totalCancOrders || 0}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default DashboardCards;
