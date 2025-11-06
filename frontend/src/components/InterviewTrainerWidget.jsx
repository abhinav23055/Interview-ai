import React, { useState, useRef, useEffect } from "react";

// InterviewTrainerWidget.jsx
// Single-file embeddable React component (default export) for an AI Interview Trainer widget.
// - Uses Tailwind CSS for layout (no import needed if your site already includes Tailwind)
// - Assumes backend endpoints exist at:
//    POST /api/generate-question  -> { role, level, history }  returns { questionId, questionText }
//    POST /api/evaluate-answer   -> { questionId, answerText, audioBlob } returns { score, feedback }
//    POST /api/analyze-posture   -> { imageBase64 } returns { postureScore, tips }
// - The component handles camera + mic access, records the user's answer (audio + short video snapshots),
//   sends the audio to evaluation and snapshots to posture analysis. All network calls are fetch() POSTs.
// - Replace the API endpoints and adapt the payloads according to your backend.

export default function InterviewTrainerWidget({
  apiBase = "", // e.g. "/api" or full URL to your backend
  defaultRole = "Software Engineer",
  defaultLevel = "intermediate",
}) {
  const [role, setRole] = useState(defaultRole);
  const [level, setLevel] = useState(defaultLevel);
  const [question, setQuestion] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [answerText, setAnswerText] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [posture, setPosture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  // Media refs
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const snapshotIntervalRef = useRef(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  async function startCamera() {
    if (mediaStreamRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      mediaStreamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {});
    } catch (err) {
      console.error("camera error", err);
      alert("Please allow camera and microphone access to use the trainer.");
    }
  }

  function stopCamera() {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }

  async function fetchQuestion() {
    setLoading(true);
    setEvaluation(null);
    setPosture(null);
    try {
      const resp = await fetch(`${apiBase}/generate-question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, level }),
      });
      const data = await resp.json();
      setQuestion(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch question. Make sure your backend is running at " + apiBase);
    } finally {
      setLoading(false);
    }
  }

  function startRecording() {
    if (!consentGiven) {
      alert("Please give consent to record audio/video before starting.");
      return;
    }
    if (!mediaStreamRef.current) startCamera();
    setIsRecording(true);
    audioChunksRef.current = [];

    const options = { mimeType: "audio/webm" };
    try {
      const recorder = new MediaRecorder(mediaStreamRef.current, options);
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.start();

      // take snapshots for posture every 1.5s
      snapshotIntervalRef.current = setInterval(async () => {
        await takeSnapshotAndAnalyze();
      }, 1500);
    } catch (err) {
      console.error("MediaRecorder error", err);
      alert("Unable to start recorder in this browser.");
      setIsRecording(false);
    }
  }

  async function stopRecording() {
    setIsRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (snapshotIntervalRef.current) {
      clearInterval(snapshotIntervalRef.current);
      snapshotIntervalRef.current = null;
    }

    // create audio blob
    const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    const answer = answerText.trim();
    // send to evaluation endpoint
    await evaluateAnswer(blob, answer);
  }

  async function evaluateAnswer(audioBlob, textAnswer) {
    setLoading(true);
    try {
      const form = new FormData();
      if (audioBlob) form.append("audio", audioBlob, "answer.webm");
      form.append("questionId", question?.questionId ?? "");
      form.append("text", textAnswer ?? "");

      const resp = await fetch(`${apiBase}/evaluate-answer`, {
        method: "POST",
        body: form,
      });
      const data = await resp.json();
      setEvaluation(data);
    } catch (err) {
      console.error(err);
      alert("Evaluation failed.");
    } finally {
      setLoading(false);
    }
  }

  async function takeSnapshotAndAnalyze() {
    if (!videoRef.current) return;
    const v = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = v.videoWidth || 320;
    canvas.height = v.videoHeight || 240;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
    // send a lightweight posture analysis (debounced on server allowed)
    try {
      const resp = await fetch(`${apiBase}/analyze-posture`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      });
      const data = await resp.json();
      setPosture(data);
    } catch (err) {
      // don't spam errors while recording
      console.debug("posture analyze error", err);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-2xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">AI Interview Trainer</h3>
        <div className="text-sm text-gray-500">Personalized practice & posture feedback</div>
      </div>

      {/* Settings */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <label className="flex flex-col">
          <span className="text-sm">Role</span>
          <input value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 p-2 border rounded" />
        </label>
        <label className="flex flex-col">
          <span className="text-sm">Level</span>
          <select value={level} onChange={(e) => setLevel(e.target.value)} className="mt-1 p-2 border rounded">
            <option value="junior">Junior</option>
            <option value="intermediate">Intermediate</option>
            <option value="senior">Senior</option>
          </select>
        </label>
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={fetchQuestion} className="px-4 py-2 rounded bg-sky-600 text-white">Get question</button>
        <button onClick={startCamera} className="px-4 py-2 rounded border">Turn on camera</button>
        <button onClick={stopCamera} className="px-4 py-2 rounded border">Turn off camera</button>
      </div>

      {/* Consent */}
      <div className="mb-4 text-sm text-gray-700">
        <label className="inline-flex items-center">
          <input type="checkbox" checked={consentGiven} onChange={(e) => setConsentGiven(e.target.checked)} className="mr-2" />
          I consent to recording audio and video for evaluation. I understand data may be stored according to the site's privacy policy.
        </label>
      </div>

      {/* Question */}
      <div className="mb-4 p-4 border rounded bg-gray-50">
        {loading ? (
          <div>Loading...</div>
        ) : question ? (
          <div>
            <div className="text-sm text-gray-500">Question</div>
            <div className="mt-2 font-medium">{question.questionText}</div>
          </div>
        ) : (
          <div className="text-gray-500">No question yet — click "Get question".</div>
        )}
      </div>

      {/* Video + Controls */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="rounded border p-2">
          <video ref={videoRef} className="w-full rounded bg-black" playsInline muted />
          <div className="flex gap-2 mt-2">
            {!isRecording ? (
              <button onClick={startRecording} className="px-3 py-1 rounded bg-green-600 text-white">Start Answer</button>
            ) : (
              <button onClick={stopRecording} className="px-3 py-1 rounded bg-red-600 text-white">Stop & Submit</button>
            )}
            <button onClick={() => { setAnswerText(""); }} className="px-3 py-1 rounded border">Clear text</button>
          </div>
        </div>

        <div className="rounded border p-2">
          <div className="text-sm text-gray-500">Type your answer (optional)</div>
          <textarea value={answerText} onChange={(e) => setAnswerText(e.target.value)} className="mt-2 w-full h-40 p-2 border rounded" placeholder="Type your answer or leave blank to only use audio."></textarea>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4">
        {evaluation && (
          <div className="p-3 border rounded mb-2 bg-white">
            <div className="text-sm text-gray-500">Evaluation</div>
            <div className="mt-1 font-medium">Score: {evaluation.score ?? "—"}</div>
            <div className="mt-2 text-sm">{evaluation.feedback ?? "No feedback provided."}</div>
          </div>
        )}

        {posture && (
          <div className="p-3 border rounded bg-white">
            <div className="text-sm text-gray-500">Posture</div>
            <div className="mt-1 font-medium">Posture score: {posture.postureScore ?? "—"}</div>
            <ul className="mt-2 list-disc list-inside text-sm">
              {(posture.tips || []).map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="text-xs text-gray-500">Tip: for better posture feedback, sit 1–2 meters from the camera so your upper body is fully visible.</div>
    </div>
  );
}
