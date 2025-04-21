import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import axios from "@/lib/axios";
import { Certificate } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { CircleCheck, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CertificateDetailsProps {
  certificate: Certificate;
  doctor_name: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

export function CertificateDetails({
  certificate,
  doctor_name,
  setActiveTab,
}: CertificateDetailsProps) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const sendCertificate = async () => {
    try {
      setLoading(true);
      const res = await axios.post("/manager/cabinet/certaficates/send", {
        certificate_id: certificate.id,
      });
      if (res.status === 200) {
        toast.success(res.data.success);
        queryClient.invalidateQueries({ queryKey: ["cabinet_certaficates"] });
        setActiveTab("list");
      }
    } catch (error) {
      console.error("Axios error:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      <Card className="border-t-4 border-t-primary">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">
                  Certificate Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Issue Date</p>
                    <p className="font-medium">
                      {new Date(certificate.issue_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Expiry Date</p>
                    <p className="font-medium">
                      {new Date(
                        certificate.expiration_date
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">
                  Patient Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Patient Name
                    </p>
                    <p className="font-medium">
                      {certificate.appointment.patient.username}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Patient Ticket
                    </p>
                    <p className="font-medium">
                      {/*certificate.appointment.ticket*/}2
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Diagnosis</h3>
                <div className="p-4 bg-muted/30 rounded-md">
                  <p>{certificate.diagnosis}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Recommendations</h3>
                <div className="p-4 bg-muted/30 rounded-md">
                  <p>{certificate.recommendations}</p>
                </div>
              </div>

              <div className="pt-6">
                <div className="border-t pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Issued by</p>
                      <p className="font-medium">{doctor_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        Digital Signature
                      </p>
                      <p className="font-medium italic">
                        Electronically signed
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="">
              <h2 className="font-bold text-lg mb-2">Status</h2>
              <div className="flex items-center gap-x-2">
                {certificate.recieved ? (
                  <Badge className="bg-green-500 gap-2 hover:bg-green-500/90 p-2">
                    <CircleCheck className="text-white w-4 h-4" />
                    Recieved
                  </Badge>
                ) : (
                  <Button disabled={loading} onClick={() => sendCertificate()}>
                    {loading && <Loader2 className="mr-2 animate-spin" />}
                    {loading ? "Sending..." : "Send"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
