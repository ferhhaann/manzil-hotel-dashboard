
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SalesTable from "@/components/SalesTable";

const SalesTabContent = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Today's Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesTabContent;
