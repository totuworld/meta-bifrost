"use client";
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { db } from "@/firebase/config";

export default function Home() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        } catch (error) {
          console.error("Error adding document: ", error);
        } finally {
          setLoading(false);
        }
      } else {
        const provider = new GoogleAuthProvider();
        if (window.confirm("You are not authenticated. Do you want to log in with Google?")) {
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl shadow-xl p-8 mb-12">
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

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="py-2">
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              URL
            </label>
            <input
              type="url"
              id="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              placeholder="https://example.com"
            />
          </div>

          <div className="py-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              placeholder="Enter title"
            />
          </div>

          <div className="py-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              placeholder="Enter description"
              rows={3}
            />
          </div>

          <div className="py-2">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              OG Image URL (Optional)
            </label>
            <input
              type="url"
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              placeholder="https://example.com/image.png"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Short URL"}
          </button>
        </form>

        {shortUrl && (
          <div className="mt-8 p-4 bg-green-50 rounded-md">
            <p className="text-sm font-medium text-green-800">Your short URL:</p>
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block text-green-600 hover:text-green-500 break-all"
            >
              {shortUrl}
            </a>
          </div>
        )}

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
      </div>
    </div>
  );
}
