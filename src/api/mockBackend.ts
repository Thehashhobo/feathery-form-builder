import { v4 as uuidv4 } from 'uuid';

// Mock backend API for development
export interface FormSubmission {
  formId: string;
  timestamp: string;
  fields: Array<{
    id: string;
    type: string;
    label: string;
    value: string;
  }>;
}

export interface SubmissionResponse {
  id: string;
  status: 'success' | 'error';
  message: string;
  data?: FormSubmission;
}

const mockDatabase: FormSubmission[] = [];

export const mockBackendAPI = {
  // Submit form data
  async submitForm(data: FormSubmission): Promise<SubmissionResponse> {
    
    // Generate unique ID
    const submissionId = `sub_${uuidv4()}`;
    
    // Store in mock database
    const submission = {
      ...data,
      formId: submissionId
    };
    mockDatabase.push(submission);
    
    console.log('Form submitted to mock backend:', submission);
    console.log('Total submissions in mock DB:', mockDatabase.length);
    
    return {
      id: submissionId,
      status: 'success',
      message: 'Form submitted successfully',
      data: submission
    };
  },

  // Get all submissions
  async getSubmissions(): Promise<FormSubmission[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockDatabase];
  },
};
