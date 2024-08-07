import { Handler } from "@netlify/functions";
import { Tag } from "@prisma/client";
import { getNetlifyFunctionHandler } from "../utils/getNetlifyFunctionHandler";

export const handler: Handler = async (event) => {
  return await getNetlifyFunctionHandler<Tag[]>({ 
    event,
    errorMessage: 'Failed to fetch tags facet',
    getQueryResponse: async ({ prisma, }) => {
      const tags = await prisma.tag.findMany({
        include: { _count: { select: { posts: true, }}}
      });
  
      const tagsWithCount = tags
        .map(tag => ({
          id: tag.id,
          name: tag.name,
          readableName: tag.name.replace(/_/g, ' '),
          count: tag._count.posts,
        }))
        .sort((a, b) => b.count - a.count);
  
      return tagsWithCount;        
    }
  });
};
