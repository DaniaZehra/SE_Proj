'use client';

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const travelData = [
  { month: 'Jan', bookings: 400, revenue: 24000, users: 240 },
  { month: 'Feb', bookings: 300, revenue: 13980, users: 221 },
  { month: 'Mar', bookings: 600, revenue: 38000, users: 429 },
  { month: 'Apr', bookings: 800, revenue: 39080, users: 600 },
  { month: 'May', bookings: 500, revenue: 48000, users: 400 },
  { month: 'Jun', bookings: 900, revenue: 68000, users: 750 }
];

const availableFilters = [
  {
    value: "bookings",
    label: "Bookings",
  },
  {
    value: "revenue",
    label: "Revenue ($)",
  },
  {
    value: "users",
    label: "New Users",
  }
]

const AnalyticsChart = () => {
  const [selection, setSelection] = useState("bookings");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Travel Performance</CardTitle>
        <CardDescription>Monthly statistics</CardDescription>
        <Select onValueChange={setSelection} defaultValue="bookings">
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select metric" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
             {availableFilters.map((filter) => (
                <SelectItem key={filter.value} value={filter.value}>
                  {filter.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pt-6">
        <div style={{width: '100%', height: 300, marginTop: '30px' }}>
          <ResponsiveContainer>
            <LineChart width={1100} height={300} data={travelData}>
              <Line 
                type='monotone' 
                dataKey={selection} 
                stroke='#8884d8' 
                strokeWidth={2}
              />
              <CartesianGrid stroke='#ccc' strokeDasharray="3 3" />
              <XAxis dataKey='month' />
              <YAxis />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsChart;