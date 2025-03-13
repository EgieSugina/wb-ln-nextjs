"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@apollo/client";
import { GET_NOVELS } from "@/lib/graphql/queries";
import { Novel, NovelsData } from "@/lib/graphql/types";
import { AddNovelForm } from "@/components/AddNovelForm";
import Link from "next/link";
import Image from "next/image";
import NovelCard from "@/components/NovelCard";

export default function NovelsPage() {
  const { loading, error, data } = useQuery<NovelsData>(GET_NOVELS);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-lg">Loading novels...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-lg text-red-500">
          Error loading novels: {error.message}
        </p>
      </div>
    );
  }

  const novels = data?.novels || [];

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Light Novels</h1>
        <AddNovelForm />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {novels.map((novel: Novel, index) => (
          <NovelCard key={index} novel={novel} />
        ))}
      </div>
    </div>
  );
}
