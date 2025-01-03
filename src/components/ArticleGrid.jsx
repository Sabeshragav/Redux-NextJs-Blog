"use client";

import React, { useEffect, useState } from "react";
import Article from "./Article";
import { useSelector } from "react-redux";
import {
  getArticleError,
  getArticleStatus,
  selectAllArticlesIds,
} from "@/features/articleSlice";
import { motion, useScroll, useSpring } from "framer-motion";

export default function ArticleGrid() {
  const articleIds = useSelector(selectAllArticlesIds);
  const articleStatus = useSelector(getArticleStatus);
  const articleError = useSelector(getArticleError);

  const [isLoaded, setIsLoaded] = useState(false);

  const { scrollYProgress } = useScroll(); // Scroll progress hook
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    setIsLoaded(true);
  });

  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading articles...
      </div>
    );
  }

  let content;
  const hasArticles =
    articleStatus === "fulfilled" && articleIds.length > 0 && isLoaded;

  if (articleStatus === "pending") {
    content = (
      <div className="h-screen flex items-center">Loading articles...</div>
    );
  } else if (articleStatus === "rejected") {
    content = (
      <div className="text-red-500 h-screen w-full flex justify-center items-center">
        {articleError || "Failed to load articles."}
      </div>
    );
  } else if (hasArticles) {
    content = articleIds.map((articleId, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <div className="transition duration-300 hover:scale-105 hover:shadow-lg">
          <Article key={articleId} articleId={articleId} />
        </div>
      </motion.div>
    ));
  } else {
    content = (
      <div className="h-screen flex items-center">No articles available</div>
    );
  }

  // Default to a consistent structure
  return (
    <div className="my-20 mx-7 flex justify-center">
      <div
        className={`grid ${
          hasArticles
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
            : "gap-10"
        }`}
      >
        {content}
      </div>

      {/* Scroll progress bar */}
      <motion.div
        className="fixed bottom-0 left-0 w-full h-2 bg-gray-100 rounded-full"
        style={{ scaleX }}
      />
    </div>
  );
}
