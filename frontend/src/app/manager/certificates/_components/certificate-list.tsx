"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FileText } from "lucide-react";
import { Certificate } from "@/types";
import { Badge } from "@/components/ui/badge";

interface CertificatesListProps {
  certificates: Certificate[];
  onView: (certificate: Certificate) => void;
}

export function CertificatesList({
  certificates,
  onView,
}: CertificatesListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  console.log(certificates);
  return (
    <div className="space-y-4">
      <div className="relative w-full sm:max-w-xs">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search certificates..."
          className="w-full pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Appointment Date</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {certificates && certificates.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-6 text-muted-foreground"
                >
                  No certificates found
                </TableCell>
              </TableRow>
            ) : (
              certificates.map((certificate) => (
                <TableRow key={certificate.id}>
                  <TableCell>
                    {certificate.appointment.patient.username}
                  </TableCell>
                  <TableCell>
                    {new Date(
                      certificate.appointment.appointment_date
                    ).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(certificate.issue_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(certificate.expiration_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {certificate.recieved ? (
                      <Badge className="bg-green-100 text-green-500 hover:bg-green-100">
                        Recieved
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-500 hover:bg-red-100">
                        Not Recieved
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView(certificate)}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      View details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
