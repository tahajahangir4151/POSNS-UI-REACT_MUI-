import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  makeStyles,
  useMediaQuery,
  Divider,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    backgroundColor: "white",
    borderRadius: theme.shape.borderRadius,
    minHeight: 300,
    transition: "all 0.3s",
    "&:hover": {
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
  },
  legendBox: {
    width: 120,
    marginLeft: theme.spacing(2),
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(1),
  },
  legendColorBox: {
    width: 12,
    height: 12,
    marginRight: theme.spacing(1),
  },
  tooltipBox: {
    backgroundColor: "white",
    padding: theme.spacing(1),
    border: "1px solid #ccc",
    borderRadius: theme.shape.borderRadius,
  },
  chartContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
  },
  chartBox: {
    flex: 1,
    height: 250,
    width: "100%",
  },
}));

const DashboardCharts = ({ data }) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  //change state name
  // const [key, setKey] = useState(0);

  // useEffect(() => {
  //   setKey((prevKey) => prevKey + 1);
  // }, [isMobile]);

  // constants
  // Colors for the charts
  const dayColors = ["#FF9999", "#99FF99", "#9999FF", "#FFCC99"];
  const foodColors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFCC99"];

  const calculatePercentages = (salesData, total) => {
    if (!salesData || salesData.length === 0) return [];
    return salesData.map((item) => ({
      name: item.name,
      value: total === 0 ? 0 : Number(((item.amount / total) * 100).toFixed(1)),
      amount: item.amount,
    }));
  };

  //useState
  const salesData = [
    { name: "Restaurant", amount: data?.totalRestSale || 0 },
    { name: "Food Panda", amount: data?.totalFPSale || 0 },
    { name: "Dastak", amount: data?.totalDastakSale || 0 },
  ];

  //useState
  const saleAnalysisData = calculatePercentages(
    salesData,
    data?.totalSale || 0
  );
  const foodData =
    (data?.top4ProdSales || []).length > 0
      ? calculatePercentages(
          data?.top4ProdSales.map((item) => ({
            name: item.productName,
            amount: item.top4ProdSale,
          })),
          data?.totalSale || 0
        )
      : [
          { name: "Food-1", value: 0, amount: 0 },
          { name: "Food-2", value: 0, amount: 0 },
          { name: "Food-3", value: 0, amount: 0 },
          { name: "Food-4", value: 0, amount: 0 },
        ];

  //Generic
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box className={classes.tooltipBox}>
          <Typography variant="body2">
            {`${payload[0].name}: ${payload[0].value}%`}
          </Typography>
        </Box>
      );
    }
    return <></>;
  };

  return (
    <Box style={{ padding: 16 }}>
      <Grid container spacing={2}>
        {/* Sales Analysis by saleType */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper elevation={0} className={classes.paper}>
            <Typography variant="h6" style={{ marginBottom: 16 }}>
              Sales Analysis by SaleType{" "}
            </Typography>
            <Box className={classes.chartContainer}>
              <Box
                className={classes.chartBox}
                style={{ height: isMobile ? 200 : 250 }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={saleAnalysisData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {saleAnalysisData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={dayColors[index % dayColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Box className={classes.legendBox}>
                {salesData.map((item, index) => (
                  <Box key={index} className={classes.legendItem}>
                    <Box
                      className={classes.legendColorBox}
                      style={{
                        backgroundColor: dayColors[index % dayColors.length],
                      }}
                    />
                    <Typography variant="body2">
                      <Typography
                        variant="body2"
                        style={{
                          fontWeight: "bold",
                        }}
                      >
                        {item.name}{" "}
                      </Typography>
                      {item.amount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      ({Math.round(saleAnalysisData[index]?.value || 0)}%)
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Divider style={{ backgroundColor: "#008000", height: "2px" }} />
        </Grid>

        {/* Popular Foods Chart */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper elevation={0} className={classes.paper}>
            <Typography variant="h6" style={{ marginBottom: 16 }}>
              Most Popular Food
            </Typography>
            <Box className={classes.chartContainer}>
              <Box
                className={classes.chartBox}
                style={{ height: isMobile ? 200 : 250 }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={foodData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {foodData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={foodColors[index % foodColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Box className={classes.legendBox}>
                {foodData.map((item, index) => (
                  <Box key={index} className={classes.legendItem}>
                    <Box
                      className={classes.legendColorBox}
                      style={{
                        backgroundColor: foodColors[index % foodColors.length],
                      }}
                    />
                    <Typography variant="body2">
                      <Typography
                        style={{ fontWeight: "bold" }}
                        variant="body2"
                      >
                        {item.name}
                      </Typography>{" "}
                      {item.amount
                        ? Math.round(item.amount).toFixed(2)
                        : "0.00"}{" "}
                      ({Math.round(item.value)}%)
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardCharts;
