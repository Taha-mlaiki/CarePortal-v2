"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, ArrowLeft } from "lucide-react";
import { Certificate } from "@/types";
import { CertificatesList } from "./_components/certificate-list";
import { CreateCertificateForm } from "./_components/certificate-form";
import { CertificateDetails } from "./_components/certificate-details";
import { cn } from "@/lib/utils";
import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import Header from "../_components/Header";

const fetchCertaficates = async () => {
  const res = await axios.get("/manager/cabinet/certaficates");
  return res.data;
};

export default function MedicalCertificatesPage() {
  const [activeTab, setActiveTab] = useState("list");
  const [selectedCertificate, setSelectedCertificate] =
    useState<Certificate | null>(null);
  const { data, isLoading } = useQuery({
    queryFn: fetchCertaficates,
    queryKey: ["cabinet_certaficates"],
  });

  const handleViewCertificate = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setActiveTab("view");
  };

  return (
    <div
      className={cn(
        "transition-all duration-200 ease-in-out",
        "lg:ml-64 min-h-screen p-5 md:p-10 pt-14 md:pt-5"
      )}
    >
      <Header
        title="Certificates Overview"
        description="Manage the certificates with ease."
      />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Medical Certificates</h1>
        {activeTab === "list" && (
          <Button variant="brand" onClick={() => setActiveTab("create")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Certificate
          </Button>
        )}
        {(activeTab === "create" || activeTab === "view") && (
          <Button variant="outline" onClick={() => setActiveTab("list")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to List
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="hidden">
          <TabsTrigger value="list">All Certificates</TabsTrigger>
          <TabsTrigger value="create">Create Certificate</TabsTrigger>
          <TabsTrigger value="view">View Certificate</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-0">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <CertificatesList
              certificates={data.certificates}
              onView={handleViewCertificate}
            />
          )}
        </TabsContent>

        <TabsContent value="create" className="mt-0">
          <CreateCertificateForm setActiveTab={setActiveTab} />
        </TabsContent>

        <TabsContent value="view" className="mt-0">
          {selectedCertificate && (
            <CertificateDetails
              setActiveTab={setActiveTab}
              certificate={selectedCertificate}
              doctor_name={data.cabinet_doctor_name}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
