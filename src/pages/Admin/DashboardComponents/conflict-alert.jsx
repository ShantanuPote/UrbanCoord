import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";

import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/Card";
import { Badge } from "../../../ui/Badge";
import { Button } from "../../../ui/Button";
import { AlertTriangle, MapPin, Package } from "lucide-react";

export default function ConflictAlerts() {
  const [conflicts, setConflicts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConflicts();
  }, []);

  const fetchConflicts = async () => {
    setLoading(true);

    const snapshot = await getDocs(collection(db, "projects"));
    const projects = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      start: new Date(doc.data().startDate),
      end: new Date(doc.data().endDate),
    }));

    const timelineConflicts = [];

    for (let i = 0; i < projects.length; i++) {
      for (let j = i + 1; j < projects.length; j++) {
        const a = projects[i];
        const b = projects[j];

        const sameLocation = a.location === b.location;
        const overlap = a.start <= b.end && b.start <= a.end;

        if (sameLocation && overlap) {
          timelineConflicts.push({
            type: "location_timeline_conflict",
            location: a.location,
            projects: [a, b],
          });
        }
      }
    }

    setConflicts(timelineConflicts);
    setLoading(false);
  };

  if (loading) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
            Conflict Detection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (conflicts.length === 0) {
    return (
      <Card className="mb-8 border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <AlertTriangle className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-green-900">No Conflicts Detected</h3>
              <p className="text-sm text-green-700">
                All resource allocations and project timelines are properly coordinated.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8 border-amber-200 bg-amber-50">
      <CardHeader>
        <CardTitle className="flex items-center text-amber-900">
          <AlertTriangle className="mr-2 h-5 w-5 text-amber-600" />
          Conflict Detection ({conflicts.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {conflicts.map((conflict, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border border-amber-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <MapPin className="h-4 w-4 text-amber-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Location Timeline Conflict</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Multiple projects scheduled at <strong>{conflict.location}</strong> with overlapping timelines
                  </p>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Conflicting projects:</p>
                    <div className="flex flex-wrap gap-1">
                      {conflict.projects?.map((project) => (
                        <Badge key={project.id} variant="secondary" className="text-xs">
                          {project.title}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <Button size="sm" variant="outline">
                Resolve
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
