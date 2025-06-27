import { useState, useEffect } from "react";
import { mockBackendAPI, type FormSubmission } from "../api/mockBackend";

interface SubmissionsViewerProps {
  onSubmissionCountUpdate?: (count: number) => void;
  refreshTrigger?: number;
}

export function SubmissionsViewer({ onSubmissionCountUpdate, refreshTrigger }: SubmissionsViewerProps) {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const loadSubmissions = async () => {
    try {
      const data = await mockBackendAPI.getSubmissions();
      setSubmissions(data);
      // Notify parent component of the submission count
      if (onSubmissionCountUpdate) {
        onSubmissionCountUpdate(data.length);
      }
    } catch (error) {
      console.error('Error loading submissions:', error);
    }
  };

  useEffect(() => {
    if (isVisible) {
      loadSubmissions();
    }
  }, [isVisible]);

  // Load submissions when refresh trigger changes (new submission)
  useEffect(() => {
    if (refreshTrigger) {
      loadSubmissions();
    }
  }, [refreshTrigger]);

  // Load initial count when component mounts
  useEffect(() => {
    loadSubmissions();
  }, []);

  if (!isVisible) {
    return (
      <button 
        onClick={() => setIsVisible(true)}
        className="submissions-toggle-btn"
      >
        View Submissions ({submissions.length})
      </button>
    );
  }

  return (
    <div className="submissions-viewer">
      <div className="submissions-header">
        <h3>Form Submissions</h3>
        <div className="submissions-actions">
          <button onClick={() => setIsVisible(false)}>
            Close
          </button>
        </div>
      </div>
      
      <div className="submissions-list">
        {submissions.length === 0 ? (
          <p className="no-submissions">No form submissions yet.</p>
        ) : (
          submissions.map((submission, index) => (
            <div key={submission.formId} className="submission-card">
              <div className="submission-header">
                <strong>Submission #{index + 1}</strong>
                <span className="submission-date">
                  {new Date(submission.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="submission-fields">
                {submission.fields.map((field) => (
                  <div key={field.id} className="field-row">
                    <span className="field-label">{field.label}:</span>
                    <span className="field-value">{field.value || '(empty)'}</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
