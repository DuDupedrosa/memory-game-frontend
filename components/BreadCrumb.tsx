import { BreadCrumbType } from "@/types/breadCrumb";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaHome } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa6";

export default function BreadCrumb({ routes }: { routes: BreadCrumbType[] }) {
  const [breadCrumbItems, setBreadCrumbItems] = useState<BreadCrumbType[] | []>(
    []
  );

  useEffect(() => {
    if (routes && routes.length) {
      setBreadCrumbItems(routes);
    }
  }, [routes]);

  return (
    <div className="mb-8">
      <ul className="flex items-center gap-1">
        <li>
          <Link
            href={"/room"}
            className="flex items-center gap-2 transition-all cursor-pointer hover:underline hover:text-gray-50 text-gray-400"
          >
            <FaHome className="text-gray-300 text-lg" />
            <span className="font-normal text-base">Home</span>
          </Link>
        </li>
        {breadCrumbItems &&
          breadCrumbItems.length > 0 &&
          breadCrumbItems.map((route, i) => {
            return (
              <li key={i}>
                <Link
                  href={route.toPath}
                  className={`flex items-center gap-1 transition-all cursor-pointer hover:underline hover:text-gray-50 ${
                    route.current ? "text-gray-50" : "text-gray-400"
                  }`}
                >
                  <FaAngleRight className="text-gray-300 text-lg" />
                  <span className="font-normal text-base">{route.label}</span>
                </Link>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
