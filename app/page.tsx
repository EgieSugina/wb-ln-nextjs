'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@apollo/client";
import { GET_NOVELS } from "@/lib/graphql/queries";

export default function Home() {
  const { loading, error, data } = useQuery(GET_NOVELS);

  const featuredNovels = data?.novels?.slice(0, 3) || [];

  return (
    <div className="space-y-6">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Web Light Novel</h1>
        <p className="text-xl text-gray-600">
          Discover and read your favorite light novels online
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Featured Novels</h2>
        {loading ? (
          <div className="text-center py-8">
            <p>Loading featured novels...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">Error loading novels: {error.message}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredNovels.map((novel: any) => (
              <Card key={novel.id}>
                <CardHeader>
                  <CardTitle>{novel.title}</CardTitle>
                  <CardDescription>
                    {novel.genres.map((genre: any) => genre.name).join(", ")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{novel.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
