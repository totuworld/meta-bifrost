"use client";
import { useState, useEffect, useRef } from "react";
import { addDoc, collection } from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { db } from "@/firebase/config";

export default function Home() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [shortUrl, setShortUrl] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus on new input when it appears
    inputRef.current?.focus();
  }, [currentStep]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const urlData = {
            originalUrl: url,
            title,
            ...(description && { description }),
            ...(image && { image }),
            createdAt: new Date(),
            uid: user.uid,
          };

          const docRef = await addDoc(collection(db, "urls"), urlData);
          const generatedShortUrl = `${window.location.origin}/${docRef.id}`;
          setShortUrl(generatedShortUrl);
          setIsModalOpen(true);
        } catch (error) {
          console.error("Error adding document: ", error);
        } finally {
          setLoading(false);
        }
      } else {
        const provider = new GoogleAuthProvider();
        if (
          window.confirm(
            "You are not authenticated. Do you want to log in with Google?"
          )
        ) {
          signInWithPopup(auth, provider)
            .then(() => {
              // User signed in
              handleSubmit(e); // Retry submission after login
            })
            .catch((error) => {
              console.error("Error during sign-in: ", error);
              setLoading(false);
            });
        } else {
          setLoading(false);
        }
      }
    });
  };

  const handleCopy = async () => {
    if (!shortUrl) return;
    try {
      await navigator.clipboard.writeText(shortUrl);
      alert("URL copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const onCloseModal = () => {
    setIsModalOpen(false);
    setShortUrl(undefined);
    setCurrentStep(1);
    setUrl("");
    setTitle("");
    setDescription("");
    setImage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isNextButtonDisabled()) {
      e.preventDefault();
      handleNextClick();
    }
  };

  const renderInputField = (step: number) => {
    const commonProps = {
      className: "w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
      onKeyDown: handleKeyDown,
      ref: step === currentStep ? inputRef : undefined
    };

    switch (step) {
      case 1:
        return (
          <div className="mb-6" key="step-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="redirect할 URL을 입력해주세요."
              {...commonProps}
            />
          </div>
        );
      case 2:
        return (
          <div className="mb-6" key="step-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="표시할 제목을 입력해주세요"
              {...commonProps}
            />
          </div>
        );
      case 3:
        return (
          <div className="mb-6" key="step-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="표시할 설명을 입력해주세요"
              {...commonProps}
            />
          </div>
        );
      case 4:
        return (
          <div className="mb-6" key="step-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OG Image URL (Optional)
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="표시할 이미지 URL을 입력해주세요. 이미지가 있을 때 더 많은 클릭을 유도할 수 있습니다."
              {...commonProps}
            />
          </div>
        );
    }
  };

  const isValidUrl = (urlString: string) => {
    const urlPattern = /^https?:\/\/.+\..+/i;
    return urlPattern.test(urlString);
  };

  const isNextButtonDisabled = () => {
    switch (currentStep) {
      case 1:
        return !url || !isValidUrl(url);
      case 2:
        return !title;
      case 3:
        return false; // Optional description
      case 4:
        return false; // Optional image
      default:
        return true;
    }
  };

  const handleNextClick = () => {
    if (currentStep === 4) {
      handleSubmit();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative pt-16 pb-20">
          {/* Remove lg:grid-cols-2, change to flex column */}
          <div className="flex flex-col">
            <div className="mb-8">
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl shadow-xl p-8 mb-8">
                  <h1 className="text-4xl font-extrabold text-center mb-4 animate-fade-in">
                    Meta Bifrost
                  </h1>
                  <p className="text-center text-white/90 text-lg max-w-2xl mx-auto leading-relaxed">
                    커리어리에 URL을 붙여넣을 때
                    <span className="font-semibold"> 메타데이터 읽기 실패</span>로
                    포스팅이 안되시나요?
                    <br />
                    <span className="inline-block mt-2 font-medium">
                      Meta Bifrost로 URL을 한번 감싸서 안전하게 공유해보세요.
                    </span>
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="w-full flex gap-1 mb-8">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className="flex-1 h-2 rounded-full bg-gray-200 relative"
                      >
                        <div
                          className={`absolute inset-0 rounded-full transition-all duration-200 ${
                            step <= currentStep ? "bg-indigo-600" : ""
                          }`}
                        />
                      </div>
                    ))}
                  </div>

                  <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                    {Array.from({ length: currentStep }, (_, i) => i + 1)
                      .reverse()
                      .map((step) => renderInputField(step))}
                  </form>
                </div>

                <p className="text-center text-sm text-gray-500 mt-8">
                  문제가 있다면 이슈를{" "}
                  <a
                    href="https://github.com/totuworld/meta-bifrost/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-500 font-medium"
                  >
                    등록
                  </a>
                  해주세요.
                </p>
              </div>
            </div>
            
            {/* Button container */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t lg:relative lg:bottom-auto lg:left-auto lg:right-auto lg:border-0 lg:p-0 lg:mt-4">
              <div className="max-w-7xl mx-auto">
                <button
                  onClick={handleNextClick}
                  disabled={isNextButtonDisabled()}
                  className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-sm transition-colors
                    ${isNextButtonDisabled()
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                >
                  {currentStep === 4 ? (
                    loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2" />
                        Generating...
                      </div>
                    ) : (
                      "Short URL 만들기"
                    )
                  ) : (
                    "다음"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center text-gray-600">
            <p className="mb-4">
              Made with ❤️ by{" "}
              <a
                href="https://github.com/totuworld"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-500 font-medium"
              >
                @totuworld
              </a>
            </p>
            <div className="flex justify-center space-x-6">
              <a
                href="https://github.com/totuworld/meta-bifrost"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700"
              >
                GitHub
              </a>
              <a
                href="https://twitter.com/totuworld"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700"
              >
                Twitter
              </a>
              <a
                href="https://linkedin.com/in/totuworld"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </footer>

        {shortUrl && isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium mb-4">Your Shortened URL</h3>
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  value={shortUrl}
                  readOnly
                  className="w-full p-2 border rounded bg-gray-50"
                />
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Copy
                </button>
              </div>
              <button
                onClick={() => onCloseModal()}
                className="w-full py-2 text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
