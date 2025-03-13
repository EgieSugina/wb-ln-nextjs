'use client';

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {useQuery} from "@apollo/client";
import {GET_NOVELS} from "@/lib/graphql/queries";
import Link from "next/link";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {Genre, Novel} from "@/lib/graphql/types";

export default function Home() {
    const {loading, error, data} = useQuery(GET_NOVELS);
    const router = useRouter();

    const featuredNovels = data?.novels?.slice(0, 3) || [];

    return (
        <div className="space-y-12">
            <section className="text-center py-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <h1 className="text-4xl font-bold mb-4">Welcome to Web Light Novel</h1>
                <p className="text-xl text-gray-600 mb-6">
                    Discover and read your favorite light novels online
                </p>
                <Button
                    className="bg-blue-500 hover:bg-blue-600"
                    onClick={() => router.push('/novels')}
                >
                    Browse All Novels
                </Button>
            </section>

            <section className="container mx-auto px-4 dark:text-white">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full justify-center">
                        {featuredNovels.map((novel: Novel) => (
                            <Link href={`/novels/${novel.id}`} key={novel.id} className="block">
                                <Card className="w-[180px] md:w-[220px] lg:w-[250px] flex flex-col hover:shadow-lg transition-shadow rounded-lg overflow-hidden dark:text-white">
                                    {/* Bagian Cover */}
                                    <div className="relative w-full aspect-[3/4]">
                                        {novel.coverImage ? (
                                            <Image
                                                src={novel.coverImage}
                                                alt={`${novel.title} cover`}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                <p className="text-gray-500">No cover image</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Bagian Info */}
                                    <CardHeader className="p-4 flex-1 flex flex-col justify-between bg-white dark:bg-gray-900">
                                        <CardTitle className="text-lg font-semibold">{novel.title}</CardTitle>
                                        <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                                            {novel.genres.map((genre: Genre) => genre.name).join(", ")}
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

        </div>
    );
}
