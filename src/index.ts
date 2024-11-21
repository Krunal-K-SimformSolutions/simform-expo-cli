import { logger } from './utils';
import { generateProject } from './GenerateProject';
import { askQuestions } from './questions';

export const main = async () => {
  try {
    logger({
      text: `                    #                                                                   
                #####                                                                   
            #########                                                                   
          ############                                                                   
      ##################                                                                
    ########################                                                             
    #############    ##########                                                          
    ##########       ##############                                                      
    #########        #################                                                   
    ############         ##############                                                  
    ###############         ###########                                                  
      ################         ########                                                  
        #############      ###########                                                  
            #########  ###############                                                  
                ######################                                                   
                  ################                                                      
                    ##########                                                          
                    #######                                                             
                    ####                                                                
                    #\n`,
      color: 'redBright'
    });
    logger({
      text: `         Simform Solutions Pvt. Ltd.\n\n`,
      color: 'redBright',
      modifiers: 'bold'
    });

    await askQuestions();

    logger({
      text: 'Generating Boilerplate, Please wait !',
      color: 'blueBright',
      modifiers: 'bold'
    });
    await generateProject();

    logger({
      text: '\n 😊 Happy Coding! 👨🏻‍💻',
      color: 'greenBright',
      modifiers: 'bold'
    });
  } catch (error) {
    logger({
      text: `\n 🫣 Facing Error! (${(error as Error).message})`,
      color: 'redBright',
      modifiers: 'bold'
    });
  }
};

export { QuestionAnswer } from './questions';
